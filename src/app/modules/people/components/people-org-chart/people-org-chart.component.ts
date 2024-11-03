import { Component, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { getInitials } from 'src/app/shared/util/formatting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-people-org-chart',
  templateUrl: './people-org-chart.component.html',
  styleUrls: ['./people-org-chart.component.scss']
})
export class PeopleOrgChartComponent implements OnInit {
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  public imgPath: string = environment.imgPath;
  public svgPath: string = environment.svgPath;
  public getInitials = getInitials;
  public collapsibleChildCount: number = 4;
  public toggleSecondLevelCollapse: boolean = false;
  public selectedIndex: number = -1;
  public expandAll: boolean = false;

  public organizationalChart: any = {
    id: 100,
    label: 'Bradley Price',
    value: 'CEO',
    children: [{
      id: 101,
      label: 'Andrea Calderon',
      value: 'Customer Support',
      selected: false
    }, {
      id: 102,
      label: 'Darius Fracken',
      value: 'Architect',
      selected: false
    }, {
      id: 103,
      label: 'Darren Brockett',
      value: 'Project Manager',
      selected: true,
      children: [{
        id: 104,
        label: 'Mark P.',
        value: 'Lead API Developer',
        selected: true,
        children: [{
          label: 'Hero Calderon',
          value: 'Senior dev'
        }, {
          label: 'Jon Cruz',
          value: 'Junior dev'
        }]
      }, {
        id: 105,
        label: 'Rey Fuertes',
        value: 'UI Developer',
        selected: false,
        children: [{
          id: 106,
          label: 'James Dy',
          value: 'Junior dev'
        }, {
          id: 107,
          label: 'Andrew B.',
          value: 'Junior dev'
        }, {
          id: 108,
          label: 'Calvin G.',
          value: 'Junior dev'
        }, {
          id: 109,
          label: 'Jose dela Cruz',
          value: 'Junior dev'
        }]
      }]
    }, {
      id: 110,
      label: 'Kyle Pearce',
      value: 'Lead Customer Support',
      selected: false,
      children: [{
        id: 111,
        label: 'James Price',
        value: 'Customer Support'
      }, {
        id: 112,
        label: 'Jonathan Poe',
        value: 'Customer Support'
      }, {
        id: 113,
        label: 'Steve Ayers',
        value: 'Customer Support'
      }, {
        id: 114,
        label: 'Andrew P',
        value: 'Customer Support'
      }, {
        id: 115,
        label: 'Matt Broach',
        value: 'Customer Support'
      }, {
        id: 116,
        label: 'Jose Pedroso',
        value: 'Customer Support'
      }]
    }]
  }

  constructor() { }

  ngOnInit(): void {
    this.moveCenter();
  }

  public onMinimize(): void {
    (document.querySelector('.people-org-chart-container .content') as HTMLElement).classList.remove('maximize');
    (document.querySelector('.inside-header-menu') as HTMLElement).classList.remove('show');
    this.moveCenter();
  }

  public onMaximize(): void {
    (document.querySelector('.people-org-chart-container .content') as HTMLElement).classList.add('maximize');
    (document.querySelector('.inside-header-menu') as HTMLElement).classList.add('show');
  }

  public onExpandAll(): void {
    this.expandAll = !this.expandAll;
  }

  public onCollapse(node: any, index: number, event: any): void {
    event.preventDefault();
    this.expandAll = false;
    this.selectedIndex = node.children[index].id;
    node.children.forEach((child: any) => {
      if (child.id === this.selectedIndex) {
        if (child.selected === false)
          child.selected = true
        else {
          child.selected = false;
          this.selectedIndex = -1;
        }
      } else {
        child.selected = false;
      }
    });
  }

  public hasChild(node: any): boolean {
    return node?.children?.length;
  }

  public getChildCount(node: any): number {
    return node?.children?.length;
  }

  public collapseChildren(node: any): boolean {
    return node?.children?.length >= this.collapsibleChildCount;
  }

  public isCollapsed(level: any): boolean {
    return this.expandAll === false
      ? level?.selected === false && this.selectedIndex !== level.id
      : false;
  }

  public isHidden(level: any): boolean {
    return this.expandAll === false
      ? level?.selected == false && this.selectedIndex !== level.id
      : false;
  }

  public onReset(): void {
    this.expandAll = false;
  }

  private moveCenter(): void {
    setTimeout(() => {
      const selector = document.querySelector('.drag-scroll-content') as any;
      selector.scroll({
        left: 450,
        top: -200,
        behavior: 'smooth'
      })
    }, 0);
  }
}
