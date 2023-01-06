import { ElementType } from "react";
import { Form, StrictFormFieldProps } from "semantic-ui-react";
import {
  SemanticInputWithController,
  SemanticInputWithControllerProps,
} from "./SemanticInputWithController";

type Props<T, K extends ElementType> = SemanticInputWithControllerProps<T, K> &
  StrictFormFieldProps;

export const SemanticFormFieldWithController = <T, K extends ElementType>(
  props: Props<T, K>
) => {
  return <Form.Field control={SemanticInputWithController} {...props} />;
};
