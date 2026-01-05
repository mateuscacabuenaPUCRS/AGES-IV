import { faker } from "@faker-js/faker";
import { Prisma, Gender, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const validCPFs: string[] = [
"20374304262",
"48546264538",
"78116423100",
"11749946220",
"69677895621",
"39228270128",
"03136172280",
"69712004465",
"69693795822",
"49593182365",
"53942076900",
"64948785989",
"52118703791",
"87899428254",
"61229174435",
"43760945872",
"77970157408",
"09764947522",
"34540613693",
"18510095663",
"26904316020",
"43853988601",
"02297717504",
"21519436904",
"22183728515",
"84407264306",
"70951431706",
"22704354006",
"21506922791",
"14149647810",
"01415761116",
"04917269610",
"36687498509",
"01554768233",
"99472630022",
"16200937745",
"40662802004",
"31085408825",
"44863509871",
"45193045553",
"09789307110",
"03323720814",
"65567720033",
"82706711850",
"77414562883",
"11008508136",
"16297180334",
"91923823205",
"07622455300",
"31634886410",
"45899242345",
"16981984857",
"32438680504",
"65486667124",
"26916756535"
];

const genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER];

const passwordHashed = bcrypt.hashSync("Password@1234", 10);

export const userDonorsMock: Prisma.UserCreateInput[] = [
  {
    email: "donor@email.com",
    password: passwordHashed,
    role: UserRole.DONOR,
    fullName: "Doador Principal",
    donor: {
      create: {
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        gender: Gender.FEMALE,
        phone: `(${faker.helpers.arrayElement(["11", "21", "31", "41", "51", "61", "71", "81", "85"])}) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cpf: validCPFs[0]
      }
    }
  },
  ...Array.from({ length: 49 }).map((_, index) => ({
    email: faker.internet.email(),
    password: passwordHashed,
    role: UserRole.DONOR,
    fullName: faker.person.fullName(),
    donor: {
      create: {
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        gender: faker.helpers.arrayElement(genders),
        phone: `(${faker.helpers.arrayElement(["11", "21", "31", "41", "51", "61", "71", "81", "85"])}) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cpf: validCPFs[index + 1]
      }
    }
  })),

  ...Array.from({ length: 5 }).map((_, index) => ({
    email: `donor.deleted${index + 1}@example.com`,
    password: passwordHashed,
    role: UserRole.DONOR,
    fullName: `${faker.person.fullName()}`,
    deletedAt: faker.date.recent({ days: 30 }),
    donor: {
      create: {
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        gender: faker.helpers.arrayElement(genders),
        phone: `(${faker.helpers.arrayElement(["11", "21", "31", "41", "51", "61", "71", "81", "85"])}) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        cpf: validCPFs[index + 50]
      }
    }
  }))
];
export const userAdminsMock: Prisma.UserCreateInput[] = [
  {
    email: "admin@email.com",
    fullName: "Admin Principal",
    password: passwordHashed,
    role: UserRole.ADMIN,
    admin: {
      create: {
        root: true
      }
    }
  },
  ...Array.from({ length: 4 }).map((_, index) => ({
    email: `admin${index + 1}@example.com`,
    fullName: faker.person.fullName(),
    password: passwordHashed,
    role: UserRole.ADMIN,
    admin: {
      create: {
        root: index < 2
      }
    }
  }))
];
