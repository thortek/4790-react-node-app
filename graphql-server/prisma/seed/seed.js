const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const instructorData = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    courses: {
      create: [
        {
          title: 'DGM 1600 Introduction to Scripting',
          description: 'Course description goes here',
          defaultCredits: '3',
          courseCode: 'DGM1600',
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    courses: {
      create: [
        {
          title: 'DGM 2760 Web Languages I',
          description: 'Course description goes here',
          defaultCredits: '3',
          courseCode: 'DGM2760',
        },
      ],
    },
  },
  {
    name: 'Thor',
    email: 'thor@prisma.io',
    courses: {
      create: [
        {
          title: 'DGM 3790 Rich Internet Application Development I',
          description: 'Build a React front-end in this course.',
          defaultCredits: '3',
          courseCode: 'DGM3790',
        },
        {
          title: 'DGM 4790 Rich Internet Application Development II',
          description: 'Build a Node/Mongodb/Postgres/GraphQL back-end in this course.',
          defaultCredits: '3',
          courseCode: 'DGM4790',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const i of instructorData) {
    const instructor = await prisma.instructor.create({
      data: i,
    })
    console.log(`Created instructor with id: ${instructor.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
