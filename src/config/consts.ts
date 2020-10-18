
export const MIN_AGE = 20
export const MAX_AGE = 70
export const SAMPLE_NAMES = ["Moshe", "Ilyahu", "Rebecca", "Alex", "Natan", "Rachel"];
export const SAMPLE_EDUCATION = ["Engineer", "Developer", "Economist", "Accountant", "Architect", "MBA"];
export const SAMPLE_DEPARTMENT = ["Sales", "R&D", "Management", "Accountance", "Security", "QA"];
export const SAMPLE_PRODUCT_TYPE = ["Programmer", "QA"];
export const COUNT_DOWN_DATE = "Oct 23, 2020 16:00:00"
export const MIN_SALARY = 5000;
export const MAX_SALARY = 30000;
export const MIN_SALARY_FIELD = 'minSalary';
export const MAX_SALARY_FIELD = 'maxSalary';
export const POLLING_INTERVAL = 4000;
export const REMOVE_ALL_PRODUCTS = 10101010101010101010101;

export const ERROR_MESSAGES: Map<string, {min: string, max: string}> = new Map ([
    ['salaryInterval', {min: 'minimal salary can\'t be less than', max: 'maximal salary can\'t be greater than'}],
    ['quantityOfEmployees', {min: 'minimal quantity can\'t be less than', max: 'maximal quantity can\'t be greater than'}],
    [MIN_SALARY_FIELD, {min: 'minimal salary can\'t be less than', max: 'maximal salary can\'t be greater than'}],
    [MAX_SALARY_FIELD, {min: 'maximal salary can\'t be less than ', max: 'maximal salary can\'t be greater than'}]
])
export const MIN_MAX_VALUES: Map<string, {min: number, max: number}> = new Map ([
    ['salaryInterval', {min: 0, max: 100000}],
    ['quantityOfEmployees', {min: 1, max: 100}],
    ['minSalary', {min: 0, max: 100000}],
    ['maxSalary', {min: 0, max: 100000}],

])
