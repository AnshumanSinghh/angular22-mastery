import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pure pipe (the default — no `pure: false`). Angular only re-runs
 * transform() when the reference of `value` actually changes, not on
 * every change-detection cycle. This is the right default for almost
 * every pipe; impure pipes are a rare, deliberate exception.
 */
@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | undefined): string {
    if (!value) return '';
    const diffDays = Math.round((value.getTime() - Date.now()) / 86_400_000);
    if (diffDays === 0) return 'Due today';
    if (diffDays > 0) return `Due in ${diffDays}d`;
    return `${Math.abs(diffDays)}d overdue`;
  }
}