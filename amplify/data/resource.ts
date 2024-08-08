import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Counter: a
    .model({ value: a.integer() })
    .authorization(allow => [allow.guest()]),
});

export const data = defineData({ schema });