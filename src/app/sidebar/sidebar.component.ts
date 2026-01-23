import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  type: 'internal' | 'external'
}

// export const ROUTES: RouteInfo[] = [
//     { path: '/dashboard', title: 'Dashboard', icon: 'nc-chart-bar-32', class: '' },
//     { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
//     { path: '/manageForm', title: 'Manage Form', icon: 'nc-settings-gear-65', class: '' },
//     { path: '/masterlists', title: 'master list', icon: 'nc-tile-56', class: '' },

// ];
export const routesLevel1: RouteInfo[] = [
  // { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
  { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '', type: 'internal' },
  { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '', type: 'internal' },
  { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '', type: 'internal' },
];
export const routesLevel2: RouteInfo[] = [
  // { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' },
  { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '', type: 'internal' },
  // { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
  { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '', type: 'internal' },
];
export const routesLevel3: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '', type: 'internal' },
  { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '', type: 'internal' },
  { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '', type: 'internal' },
  { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '', type: 'internal' },

];
export const routesAdmin: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '', type: 'internal' },
  { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '', type: 'internal' },
  { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '', type: 'internal' },
  { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '', type: 'internal' },
  { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '', type: 'internal' },
  { path: '/masterlists', title: 'master list', icon: 'bi bi-list-task', class: '', type: 'internal' },
  { path: '/sectionManage', title: 'Section Manage', icon: 'bi bi-diagram-3', class: '', type: 'internal' },
  { path: '/user', title: 'Users Manage', icon: 'bi bi-people', class: '', type: 'internal' },
  { path: '/mailler', title: 'Mailler Manage', icon: 'bi bi-envelope', class: '', type: 'internal' },
  { path: '/reportManage', title: 'Report Manage', icon: 'bi bi-file-earmark-spreadsheet', class: '', type: 'internal' },
  { path: '/searchDatabase', title: 'Outsource Analysis Database', icon: 'bi bi-clipboard2-data', class: '', type: 'internal' },
  { path: '/outsource', title: 'Outsource Analysis Database', icon: 'bi bi-clipboard2-data', class: '', type: 'internal' },
  { path: '/MasterOutsource', title: 'Outsource Analysis Database', icon: 'bi bi-clipboard2-data', class: '', type: 'internal' },
  { path: '/viewFormSearch', title: 'Outsource Analysis Database', icon: 'bi bi-clipboard2-data', class: '', type: 'internal' },
  { path: '/editView', title: 'Outsource Analysis Database', icon: 'bi bi-clipboard2-data', class: '', type: 'internal' },
  { path: '/electricalSearch', title: 'Electrical Database', icon: 'bi bi-calculator', class: '', type: 'internal' },
  { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '', type: 'internal' },
  { path: '/electricalMaster', title: 'Electrical Database', icon: 'bi bi-calculator', class: '', type: 'internal' },



  // { path: '/searchElectrical', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' },
  // { path: '/inputElectrical', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' },


];

export let equipmentItems: RouteInfo[] = [
]

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  public menuItems: any[];
  equipmentItemsTemp: RouteInfo[]
  public UserLevel1 = localStorage.getItem('AR_UserLevel1');
  public UserLevel2 = localStorage.getItem('AR_UserLevel2');
  public UserLevel3 = localStorage.getItem('AR_UserLevel3');
  public UserLevel4 = localStorage.getItem('AR_UserLevel4');
  public UserLevel5 = localStorage.getItem('AR_UserLevel5');
  public UserLevel6 = localStorage.getItem('AR_UserLevel6');
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
    if (ArrUserLevel.find(i => i == '1') && localStorage.getItem('AR_UserEmployeeCode') == 'guest') {
      let temp = [
        { path: '/dashboard-guest', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' , type: 'internal'},
        { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
        { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' , type: 'internal'},
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
          { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' , type: 'internal'},
          { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
          { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' , type: 'internal'},
          { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
          { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' , type: 'internal'},
          { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
          { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},
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
            { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' , type: 'internal'},
            { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
            { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
            { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' , type: 'internal'},
            { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
            { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},

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
              { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' , type: 'internal'},
              { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
              { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
              { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' , type: 'internal'},
              { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
              { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},
            ]
            Permission = temp
          } else
            if (
              (ArrUserLevel.find(i => i == '1')) &&
              (ArrUserLevel.find(i => i == '2'))
            ) {
              let temp = [
                { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
                { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' , type: 'internal'},
                { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},

              ]
              Permission = temp
            } else
              if (
                (ArrUserLevel.find(i => i == '1'))
              ) {
                let temp = [
                  { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
                  { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' , type: 'internal'},
                  { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
                  { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
                  { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},

                ]
                Permission = temp
              } else
                if (
                  (ArrUserLevel.find(i => i == '2'))
                ) {
                  let temp = [
                    { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
                    { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
                    { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
                    { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},

                  ]
                  Permission = temp
                } else
                  if (
                    (ArrUserLevel.find(i => i == '0'))
                  ) {
                    let temp = [
                      { path: '/dashboard', title: 'Dashboard', icon: 'bi bi-bar-chart', class: '' , type: 'internal'},
                      { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' , type: 'internal'},
                      { path: '/manageForm', title: 'Manage Form', icon: 'bi bi-journal-arrow-down', class: '' , type: 'internal'},
                      { path: '/library', title: 'Library Search', icon: 'bi bi-search', class: '' , type: 'internal'},
                      { path: '/analysisDataList', title: 'Analysis Data List', icon: 'bi bi-files', class: '' , type: 'internal'},
                      { path: '/masterlists', title: 'master list', icon: 'bi bi-list-task', class: '' , type: 'internal'},
                      { path: '/sectionManage', title: 'Section Manage', icon: 'bi bi-diagram-3', class: '' , type: 'internal'},
                      { path: '/user', title: 'Users Manage', icon: 'bi bi-people', class: '' , type: 'internal'},
                      { path: '/mailler', title: 'Mailler Manage', icon: 'bi bi-envelope', class: '' , type: 'internal'},
                      { path: '/reportManage', title: 'Report Manage', icon: 'bi bi-file-earmark-spreadsheet', class: '' , type: 'internal'},
                      { path: '/searchDatabase', title: 'Outsource', icon: 'bi bi-clipboard2-data', class: '' , type: 'internal'},
                      { path: '/electricalInput', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},



                      // { path: '/inputElectrical', title: 'Electrical Database', icon: 'bi bi-calculator', class: '' , type: 'internal'},
                      // { path: '/equipment', title: 'Equipment', icon: 'bi bi-tools', class: '' , type: 'internal'},
                    ]

                    Permission = temp
                    const eTemp: RouteInfo[] = [
                      {
                        path: 'add-equipment', title: 'Add', icon: 'bi bi-plus-lg', class: '', type: 'internal'
                      },
                      {
                        path: 'equipment-master-manage', title: 'Master', icon: 'bi bi bi-gear', class: '', type: 'internal'
                      },
                    ]
                    this.equipmentItemsTemp = eTemp
                  }
    }

    this.menuItems = Permission
    const equipment = {
      path: '/equipment', title: 'Equipment', icon: 'bi bi-tools', class: '', type: 'internal'
    }
    const backToPortal = {
      path: 'http://10.200.90.152:8081/an-portal', title: 'Back to Portal', icon: 'bi bi-reply', class: '', type: 'external'
    }
    this.menuItems.push(equipment)
    this.menuItems.push(backToPortal)

  }

  toggleAnalysisEquipment() {
    let toggle = document.getElementById('sub-menu')
    if (toggle.style.height) {
      toggle.style.height = ''
    } else {
      toggle.style.height = '200px'
    }

  }
}
