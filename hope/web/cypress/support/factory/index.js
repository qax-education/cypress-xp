import { faker } from '@faker-js/faker'

import _ from 'underscore'

const images = [
    'kids-playground-1.png',
    'kids-playground-2.png',
    'kids-playground-3.png',
    'kids-playground-4.png',
    'kids-playground-5.png',
    'kids-playground-6.png',
    'kids-playground-7.png',
    'kids-playground-8.png',
    'kids-playground-9.png',
    'kids-playground-10.png',
    'kids-playground-11.png',
    'kids-playground-12.png',
    'kids-playground-13.png',
    'kids-playground-14.png'
]

export default {
    generator: function() {
        return {
            name: faker.company.name(),
            description: faker.lorem.paragraph(),
            opening_hours: faker.word.words(3),
            open_on_weekends: true,
            position: {
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude()
            },
            image: _.sample(images)
        }
    }
}