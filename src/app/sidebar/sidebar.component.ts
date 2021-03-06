import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

// export const ROUTES: RouteInfo[] = [
//     { path: '/dashboard', title: 'Dashboard', icon: 'nc-chart-bar-32', class: '' },
//     { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
//     { path: '/manageForm', title: 'Manage Form', icon: 'nc-settings-gear-65', class: '' },
//     { path: '/masterlists', title: 'master list', icon: 'nc-tile-56', class: '' },

// ];
export const routesLevel1: RouteInfo[] = [
    // { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
    { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
];
export const routesLevel2: RouteInfo[] = [
    // { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
    // { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
];
export const routesLevel3: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
    { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },

];
export const routesAdmin: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
    { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
    { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
    { path: '/masterlists', title: 'master list', icon: 'bi bi-list-task', class: '' },
    { path: '/sectionManage', title: 'Section Manage', icon: 'bi bi-diagram-3', class: '' },
    { path: '/user', title: 'Users Manage', icon: 'bi bi-people', class: '' },
    { path: '/mailler', title: 'Mailler Manage', icon: 'bi bi-envelope', class: '' },
    { path: '/reportManage', title: 'Report Manage', icon: 'bi bi-file-earmark-spreadsheet', class: '' },

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public UserLevel1 = sessionStorage.getItem('UserLevel1');
    public UserLevel2 = sessionStorage.getItem('UserLevel2');
    public UserLevel3 = sessionStorage.getItem('UserLevel3');
    public UserLevel4 = sessionStorage.getItem('UserLevel4');
    public UserLevel5 = sessionStorage.getItem('UserLevel5');
    public UserLevel6 = sessionStorage.getItem('UserLevel6');
    ngOnInit() {

        let ArrUserLevel = [];
        ArrUserLevel.push(this.UserLevel1)
        ArrUserLevel.push(this.UserLevel2)
        ArrUserLevel.push(this.UserLevel3)
        ArrUserLevel.push(this.UserLevel4)
        ArrUserLevel.push(this.UserLevel5)
        ArrUserLevel.push(this.UserLevel6)





        let Permission: any;
        // * Permission Requester && Analysis
        // * 0 : Admin
        // * 1 : Requestor
        // * 2 : Requestor Approve
        // * 3 : Analysis AE window
        // * 4 : Analysis ENG
        // * 5 : Analysis Reviewer
        // * 6 : Analysis Approve
        if (ArrUserLevel.find(i => i == '1') && sessionStorage.getItem('UserEmployeeCode') == 'guest') {
            let temp = [
                { path: '/dashboard-guest', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
                { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
            ]
            Permission = temp
        } else {
            if (
                (ArrUserLevel.find(i => i == '1') && ArrUserLevel.find(i => i == '3')) ||
                (ArrUserLevel.find(i => i == '1') && ArrUserLevel.find(i => i == '4')) ||
                (ArrUserLevel.find(i => i == '1') && ArrUserLevel.find(i => i == '5')) ||
                (ArrUserLevel.find(i => i == '1') && ArrUserLevel.find(i => i == '6'))
            ) {
                let temp = [
                    { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
                    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                    { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
                    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                    { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },

                ]
                Permission = temp
            } else
                if (
                    (ArrUserLevel.find(i => i == '2') && ArrUserLevel.find(i => i == '3')) ||
                    (ArrUserLevel.find(i => i == '2') && ArrUserLevel.find(i => i == '4')) ||
                    (ArrUserLevel.find(i => i == '2') && ArrUserLevel.find(i => i == '5')) ||
                    (ArrUserLevel.find(i => i == '2') && ArrUserLevel.find(i => i == '6'))
                ) {
                    let temp = [
                        { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
                        { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                        { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                        { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
                    ]
                    Permission = temp
                } else
                    if (
                        (ArrUserLevel.find(i => i == '3')) ||
                        (ArrUserLevel.find(i => i == '4')) ||
                        (ArrUserLevel.find(i => i == '5')) ||
                        (ArrUserLevel.find(i => i == '6'))
                    ) {
                        let temp = [
                            { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
                            { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                            { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                            { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
                        ]
                        Permission = temp
                    } else
                        if (
                            (ArrUserLevel.find(i => i == '1')) &&
                            (ArrUserLevel.find(i => i == '2'))
                        ) {
                            let temp = [
                                { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                                { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
                                { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                            ]
                            Permission = temp
                        } else
                            if (
                                (ArrUserLevel.find(i => i == '1'))
                            ) {
                                let temp = [
                                    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                                    { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
                                    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                                ]
                                Permission = temp
                            } else
                                if (
                                    (ArrUserLevel.find(i => i == '2'))
                                ) {
                                    let temp = [
                                        { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                                        { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                                    ]
                                    Permission = temp
                                } else
                                    if (
                                        (ArrUserLevel.find(i => i == '0'))
                                    ) {
                                        let temp = [
                                            { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
                                            { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
                                            { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' },
                                            { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' },
                                            { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' },
                                            { path: '/masterlists', title: 'master list', icon: 'bi bi-list-task', class: '' },
                                            { path: '/sectionManage', title: 'Section Manage', icon: 'bi bi-diagram-3', class: '' },
                                            { path: '/user', title: 'Users Manage', icon: 'bi bi-people', class: '' },
                                            { path: '/mailler', title: 'Mailler Manage', icon: 'bi bi-envelope', class: '' },
                                            { path: '/reportManage', title: 'Report Manage', icon: 'bi bi-file-earmark-spreadsheet', class: '' },
                                        ]
                                        Permission = temp
                                    }
        }

        this.menuItems = Permission
        // console.log('rr', rr);

        // console.log(this.menuItems);
        // console.log(routesLevel3);





    }
}
