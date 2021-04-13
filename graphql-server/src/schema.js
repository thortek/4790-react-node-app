const {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} = require('nexus')
const { GraphQLDateTime } = require('graphql-iso-date')

const DateTime = asNexusMethod(GraphQLDateTime, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allInstructors', {
      type: 'Instructor',
      resolve: (_parent, _args, context) => {
        return context.prisma.instructor.findMany()
      },
    })

    t.nonNull.list.nonNull.field('allCourses', {
      type: 'Course',
      resolve: (_parent, _args, context) => {
        return context.prisma.course.findMany()
      },
    })

    t.nullable.field('courseById', {
      type: 'Course',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.course.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

/*     t.nonNull.list.nonNull.field('feed', {
      type: 'Post',
      args: {
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'PostOrderByUpdatedAtInput',
        }),
      },
      resolve: (_parent, args, context) => {
        const or = args.searchString
          ? {
              OR: [
                { title: { contains: args.searchString } },
                { content: { contains: args.searchString } },
              ],
            }
          : {}

        return context.prisma.post.findMany({
          where: {
            published: true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        })
      },
    }) */

    /* t.list.field('draftsByUser', {
      type: 'Post',
      args: {
        userUniqueInput: nonNull(
          arg({
            type: 'UserUniqueInput',
          }),
        ),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.user
          .findUnique({
            where: {
              id: args.userUniqueInput.id || undefined,
              email: args.userUniqueInput.email || undefined,
            },
          })
          .posts({
            where: {
              published: false,
            },
          })
      },
    }) */
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
  t.nonNull.field('createInstructor', {
      type: 'Instructor',
      args: {
        data: nonNull(
          arg({
            type: 'InstructorCreateInput',
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.instructor.create({
          data: {
            name: args.data.name,
            email: args.data.email,
          },
        })
      },
    }) 

    t.field('createCourse', {
      type: 'Course',
      args: {
        data: nonNull(
          arg({
            type: 'CourseCreateInput',
          }),
        ),
        instructorEmail: nonNull(stringArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.course.create({
          data: {
            title: args.data.title,
            description: args.data.description,
            instructor: {
              connect: { email: args.instructorEmail },
            },
          },
        })
      },
    })

    /* t.field('togglePublishPost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
          select: {
            published: true,
          },
        })

        if (!post) {
          throw new Error(
            `Post with ID ${args.id} does not exist in the database.`,
          )
        }

        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: { published: !post.published },
        })
      },
    }) */

    /* t.field('incrementPostViewCount', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        })
      },
    }) */

    t.field('deleteCourse', {
      type: 'Course',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.course.delete({
          where: { id: args.id },
        })
      },
    })
  },
}) 

const Instructor = objectType({
  name: 'Instructor',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('courses', {
      type: 'Course',
      resolve: (parent, _, context) => {
        return context.prisma.instructor
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .courses()
      },
    })
  },
})

const Course = objectType({
  name: 'Course',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('title')
    t.string('description')
    t.string('defaultCredits')
    t.string('courseCode')
    t.field('instructor', {
      type: 'Instructor',
      resolve: (parent, _, context) => {
        return context.prisma.course
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .instructor()
      },
    })
  },
})

/* const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})*/

const CourseCreateInput = inputObjectType({
  name: 'CourseCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('description')
  },
})


const InstructorCreateInput = inputObjectType({
  name: 'InstructorCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
  },
})

const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Course,
    Instructor,
    // UserUniqueInput,
    InstructorCreateInput,
    CourseCreateInput,
    // SortOrder,
    // PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

module.exports = {
  schema: schema,
}
