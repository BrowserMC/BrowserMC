import config from './config.js'

export default async () => {
  // minecraft-data 对应json路径
  const dataPaths = (await axios.get(config.dataUrl + 'dataPaths.json')).data.pc[config.version]
  // 方块信息
  const blocks = (await axios.get(config.dataUrl + dataPaths.blocks + '/blocks.json')).data
  // blockEidBySid[方块StateId] = 方块EId
  let blockByStateId = []
  for (let i = 0; i < blocks.length; i++) {
    for (let j = blocks[i].minStateId; j <= blocks[i].maxStateId; j++) {
      blockByStateId[j] = i
    }
  }
  // 方块状态对应的模型
  const blocksStates = (await axios.get(config.assetsUrl + '/blocks_states.json')).data
  const blocksModels = (await axios.get(config.assetsUrl + '/blocks_models.json')).data


  const getBlockProperties = (stateId) => {
    let properties = {}
    let id = blockByStateId[stateId]
    let block = blocks[id]
    let meta = stateId - block.minStateId
    for (let i = block.states.length - 1; i >= 0; i--) {
      let prop = block.states[i]
      switch (prop.type) {
        case 'enum':
          properties[prop.name] = prop.values[meta % prop.num_values]
          break;
        case 'bool':
          properties[prop.name] = String(Boolean(!(meta % prop.num_values)))
          break;
        default:
          properties[prop.name] = meta % prop.num_values
          break;
      }
      meta = Math.floor(meta / prop.num_values)
    }
    return properties
  }

  // 用StateId获取方块模型
  const getBlockModel = (stateId) => {
    const getBlockModelParts = (stateId) => {
      const randomModel = (models) => {
        if (!Array.isArray(models)) return models
        let pool = []
        for (let i = 0; i < models.length; i++) {
          let count = models[i].weight || 1
          for (; count--;) {
            pool.push(i)
          }
        }
        return models[pool[Math.floor(Math.random() * pool.length)]]
      }

      const isSatisfy = (prop, cond) => {
        for (let k of Object.keys(cond)) {
          let vals = cond[k].split('|')
          if (vals.indexOf(prop[k]) === -1) {
            return false
          }
        }
        return true
      }

      let block = blocks[blockByStateId[stateId]]
      let models = blocksStates[block.name]
      let properties = getBlockProperties(stateId)
      if (models.variants) {
        let statesStr = Object.keys(models.variants)[0]
        if (statesStr === '') {
          return randomModel(models.variants[''])
        }
        let states = []
        for (let i of statesStr.split(',')) {
          states.push(i.split('=')[0])
        }
        statesStr = ''
        for (let i of states) {
          statesStr += `${i}=${properties[i]},`
        }
        statesStr = statesStr.slice(0, -1)
        return [randomModel(models.variants[statesStr])]
      } else if (models.multipart) {
        let multiPart = []
        for (let i of models.multipart) {
          if (i.when.OR) {
            for (let j of i.when.OR) {
              if (isSatisfy(properties, j)) {
                multiPart.push(randomModel(i.apply))
                break
              }
            }
          } else {
            if (isSatisfy(properties, i.when)) {
              multiPart.push(randomModel(i.apply))
            }
          }
        }
        return multiPart
      }
    }
    const getElement = (model) => {
      // console.log(model)
      let modelJson = JSON.stringify(model)
      for (let i of Object.keys(model.textures)) {
        modelJson = modelJson.replace(new RegExp(`#${i}`, "gm"), model.textures[i])
      }
      model = JSON.parse(modelJson)
      if (model.parent === undefined) {
        if (model.textures && model.textures.particle) {
          model.textures = {
            particle: model.textures.particle
          }
        }
        return model
      }
      let res = blocksModels[model.parent.split('/')[1]]
      let json = JSON.stringify(res)
      for (let i of Object.keys(model.textures)) {
        json = json.replace(new RegExp(`#${i}`, "gm"), model.textures[i])
      }
      res = JSON.parse(json)
      for (let i of Object.keys(model)) {
        if (i === 'parent') {
          continue
        } else if (i === 'textures') {
          res.textures = model.textures.particle ? { particle: model.textures.particle } : {}
        } else {
          res[i] = model[i]
        }
      }
      return getElement(res)
    }
    let models = []
    for (let i of getBlockModelParts(stateId)) {
      let modelName = i.model.split('/')[1]
      let model = Object.assign({}, i)
      model.model = getElement(blocksModels[modelName])
      models.push(model)
    }
    return models
  }

  return {
    blocks,
    blockByStateId,
    blocksStates,

    getBlockProperties,
    getBlockModel
  }
}