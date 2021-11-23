export const OPERANDS = {
  eq: '=',
  gt: '>',
  gte: '>=',
  in: 'IN (:...&)',
  like: `LIKE '%&%'`,
  'left-like': `LIKE '&%'`,
  'right-like': `LIKE '%&'`,
  lt: '<',
  lte: '<=',
  ne: '<>',
  nin: 'NOT IN (:...&)',
  isnull: 'IS NULL',
  isnotnull: 'IS NOT NULL'
}

