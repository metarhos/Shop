export const PATH_HOME = '/';
export const PATH_EMPLOYEES = '/employees';
export const PATH_SHOP = '/shop/programmers';
export const PATH_TESTERS = '/shop/testers';
export const PATH_BASKET = '/basket';
export const PATH_ADD_EMPLOYEE = '/employee';
export const PATH_ADD_PRODUCT = '/product';
export const PATH_GENERATION = '/employees/generation';
export const PATH_SEARCH = '/employees/search';
export const PATH_DEPARTMENT_STATISTICS = '/department/statistics';
export const PATH_SALARY_STATISTICS = '/salary/statistics';
export const PATH_LOGIN = '/login';

export const PATH_LOGOUT = '/logout';

export const menu: { path: string, label: string, admin?: boolean }[] = [
    {path: PATH_HOME, label: 'Home'},
    {path: PATH_SHOP, label: 'Shop'},
    {path: PATH_ADD_PRODUCT, label: 'New Product', admin: true},
     {path: PATH_EMPLOYEES, label: 'Employees', admin: true},
     {path: PATH_DEPARTMENT_STATISTICS, label: 'Statistics', admin: true},
    {path: PATH_BASKET, label: 'Basket'},
    {path: PATH_LOGOUT, label: 'Logout'},
]



export interface menuItem {
    path: string, label: string, admin?: boolean
}
type Menu =  {
    employeeMenu: menuItem[],
    employeeMenuStatistic: menuItem[],
    shopMenu: menuItem[]
}

export const dropMenu: Menu[] = [
    {
        employeeMenu: [
            {path: PATH_EMPLOYEES, label: 'Employees'},
            {path: PATH_ADD_EMPLOYEE, label: 'Add new Employee', admin: true},
            {path: PATH_GENERATION, label: 'Generation of Employees', admin: true},
            {path: PATH_SEARCH, label: 'Employees Search'}
        ]
        ,
        employeeMenuStatistic: [
            {path: PATH_DEPARTMENT_STATISTICS, label: 'Department Statistics'},
            {path: PATH_SALARY_STATISTICS, label: 'Salary Statistics'},
        ],
        shopMenu: [
            {path: PATH_SHOP, label: 'Programmers'},
            {path: PATH_TESTERS, label: 'Testers'},
        ]
    },
]
