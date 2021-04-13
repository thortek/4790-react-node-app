const { PrismaClient } = require('@prisma/client')
const uvu_courses = require('./uvu_courses.json')

const prisma = new PrismaClient()

const course_prefixes = ['DGM','CS','IT','INFO']

async function loadUVUCourses() {
    const allCourses = uvu_courses['comet'].course
    const cetCourses = allCourses.filter(
        (course) => course_prefixes.includes(course.prefix._text)
    )
    return cetCourses.map((crs) => {
        return {
            data: {
                title: crs.title._text,
                description: crs.description._text,
                defaultCredits: crs.totalCredits._text,
                courseCode: `${crs.prefix._text} ${crs.number._text}`
        }
    }
})
}

async function main() {
    const allCourses = await loadUVUCourses()
    for (const crs of allCourses) {
        try {
            await prisma.course.create(crs)
        } catch (error) {
            console.log(`Error creating course: ${error}`)
        }
    }
}

main()
    .catch((e) => {
    throw e
    })
    .finally(async () => {
    await prisma.$disconnect()
})