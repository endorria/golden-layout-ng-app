import { Component, Inject } from '@angular/core';
import { ComponentContainer, JsonValue } from 'golden-layout';
import { BaseComponentDirective } from './base-component.directive';

@Component({
  selector: 'app-text-component',
  template: `
    <input #input id="input" type="text" [value]="initialValue" (input)="updateValue(input.value)">
  `,
  styles: [`#input { display: block; }`]
})
export class TextComponent extends BaseComponentDirective {
  private value: string;
  public initialValue: string;

  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer) {
    super();

    this.container.stateRequestEvent = () => this.handleContainerStateRequestEvent();

    const state = this.container.getInitialState();
    let textValue: string;
    if (state === undefined) {
      textValue = TextComponent.undefinedTextValue;
    } else {
      if (!JsonValue.isJson(state)) {
        textValue = '<Unexpect type>';
      } else {
        const textState: TextComponent.State = state as TextComponent.State;
        textValue = textState.text;
      }
      this.value = textValue;
      this.initialValue = textValue;
    }
  }

  updateValue(value: string) {
    this.value = value;
  }

  handleContainerStateRequestEvent(): TextComponent.State | undefined {
    if (this.value === TextComponent.undefinedTextValue) {
      return undefined;
    } else {
      return {
        text: this.value,
      };
    }
  }
}

export namespace TextComponent {
  export const undefinedTextValue = '<undefined>';

  type TextPropertyName = 'text';
  export type State = { [propertyName in TextPropertyName]: string }
}
