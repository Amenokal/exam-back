import axios from 'axios'
import Logger from '../services/logger.service.js'
import { hashPassword } from '../services/encrypt.service.js'

export async function seedApp(sequelize, models, { drop, sync, seed }) {
  if(drop || seed)
  console.log('-•- SEEDING APP -•-')

  if(drop) {
    sequelize.drop()
    console.log('Tables dropped')
  }

  if(sync) {
    await sequelize.sync({ force: true })
    console.log('Sequelize synchronized')
  }

  if(seed) {
    console.log('Seeding app')
    await seedTypes(models)
    await createShops(models)
    await addShopsGeoData(models)
    await addShopsExtraData(models)
    await seedUsers(models)
    await seedReviews(models)
  }

  if(drop || seed)
  console.log('\n-•- SEEDING APP COMPLETE -•-')
}

/**
 * Seed note types
 * -•-----------•-
 * Renseigne la DB avec les types de notes utilisés par l'application
 */

async function seedTypes(models) {
  if( (await models.NoteTypeModel.findAll()).length ) {
    Logger.log('   • Seeding note types ... SKIP')
    return
  }

  Logger.printProgress('   • Seeding note types...')

  const NOTE_TYPES = [
    { name: "Pâte" },
    { name: "Texture" },
    { name: "Goût" },
    { name: "Rapport qualité/prix" },
  ]

  NOTE_TYPES.forEach(async (el) => {
    await NoteTypeModel.create(el)
  })

  Logger.printProgress('   • Seeding note types ... DONE')
}

/**
 * Seed Open Street Map data
 * -•---------------------•-
 * Utilise l'API OverPass d'Open Street Map
 * Récupère toutes les boulangeries françaises et leurs coordonnées GPS
 */

async function createShops(models) {
  if( (await models.ShopModel.findAll()).length ) {
    Logger.log('   • Create shops ... SKIP')
    return
  }

  const baseURL = 'https://overpass-api.de/api/interpreter?data='
  const inJSON = '[out:json];'
  const inFrance = 'area["name"="France"]->.boundaryarea;'
  const getBakeriesWithName = '(nwr(area.boundaryarea)[shop=bakery]["name"];);'
  const endQuery = 'out;'

  const osmQuery = baseURL + inJSON + inFrance + getBakeriesWithName + endQuery

  Logger.setInterval("   • Create shops > OSM request")
  const res = await axios.get(osmQuery)
  Logger.resetInterval()

  Logger.printProgress('   • Create shops > creating shops :')
  const validElements = res.data.elements.filter((data) => data && data.lat && data.lon && data.tags && data.tags.name)
  for (const [i, el] of validElements.entries()) {
    await models.ShopModel.create({
      name: el.tags.name,
      lat: el.lat,
      lng: el.lon,
      cityName: "",
      regionCode: 0
    })
    Logger.printProgress('   • Create shops > creating shops : ' + (i + 1).toString() + '/' + validElements.length.toString())
  }

  Logger.printProgress('   • Create shops ... DONE !')
}

/**
 * Seed Open Street Map data
 * -•---------------------•-
 * Utilise l'API gouvernementale
 * Récupère les communes associées aux coordonées GPS pour chaque boulangerie
 */

async function addShopsGeoData(models) {
  const allShops = await models.ShopModel.findAll()
  const shops = allShops.filter((el) => !el.city && !el.departement)

  if(!shops.length) {
    Logger.log('   • Seeding shops ... SKIP')
    return
  }

  for (const [i, shop] of shops.entries()) {
    const res = await axios.get(`https://geo.api.gouv.fr/communes?lat=${shop.lat}&lon=${shop.lng}`)

    if(!res.data.at(0) || isNaN(res.data.at(0).codeDepartement)) continue;

    await shops[i].update({
      city: res.data.at(0).nom,
      departement: res.data.at(0).codeDepartement
    })

    await shops[i].save()

    Logger.printProgress('   • Seeding shops > adding city data : ' + (i + 1 + (allShops.length-shops.length)).toString() + '/' + allShops.length.toString())
  }
  Logger.printProgress('   • Seeding shops ... DONE !\n')
}

async function addShopsExtraData() {
  //...
}

/**
 * Seed users & reviews
 * -•----------------•-
 * Utilise l'API Randomapi
 * Rempli la DB avec de faux utilisateurs et de faux avis
 */

async function seedUsers(models) {

  if( (await models.UserModel.findAll()).length ) {
    Logger.log('   • Creating users ... SKIP')
    return
  }

  Logger.setInterval('   • Seeding users')
  const users = await axios.get('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole')
  Logger.resetInterval()

  for(const [i, user] of users) {
    await models.UserModel.create({
      firstName: user.first,
      lastName: user.last,
      email: user.email,
      password: await hashPassword("password"),
      isAdmin: false
    })
    Logger.printProgress('   • Create users : ' + i.toString() + '/' + users.length.toString())
  }

  Logger.printProgress('   • Created ' + users.length.toString() + 'users ... DONE !')
}

async function seedReviews(models) {

  if( (await models.ReviewModel.findAll()).length ) {
    Logger.log('   • Creating reviews ... SKIP')
    return
  }

  const shops = await modelsShopModel.findAll()
  const users = await modelsUserModel.findAll()

  users.forEach(async (user) => {
    const reviewNb = Math.floor(Math.random() * 30)

    for (let i = 0; i < reviewNb; i++) {
      const rdmShop = shops.at(Math.floor(Math.random() * shops.length))
      const review = await models.ReviewModel.create({ userId: user.id, shopId: rdmShop.id })

      for (let j = 0; j < 3; j++) {
        await models.NoteModel.create({
          noteTypeId: j + 1,
          reviewId: review.id,
          amount: Math.floor(Math.random() * 4) + 1
        })
      }
    }
  })
}