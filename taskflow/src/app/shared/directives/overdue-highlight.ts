import { Directive, input } from '@angular/core';

/**
 * Attribute directive: adds behavior/styling to an existing element
 * rather than rendering its own template. `host` here is the modern,
 * object-based way of doing what @HostBinding used to do.
 *
 * Why this exists separately from TaskCard's own [class.task-card--overdue]
 * binding: that binding is logic baked into ONE component. This directive
 * is the same visual behavior, but reusable on any element — a project
 * card, a notification banner, anything that needs an "overdue" look.
 */
@Directive({
  selector: '[appOverdueHighlight]',
  host: {
    '[class.overdue-highlight]': 'overdue()',
  },
})
export class OverdueHighlight {
  readonly overdue = input<boolean>(false, { alias: 'appOverdueHighlight' });
}