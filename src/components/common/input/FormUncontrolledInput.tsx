import clsx from "clsx";
import { forwardRef, HTMLProps, ReactNode } from "react";
import { Form } from "semantic-ui-react";
import { isString } from "../../../helpers/is";
import { Override } from "../../../types/util";

type Props = Override<HTMLProps<HTMLInputElement>, { label?: ReactNode }> & {
  error?: boolean | string;
};

export const FormUncontrolledInput = forwardRef<HTMLInputElement, Props>(
  function FormUncontrolledInput(props, ref) {
    const { id, name, label, className, error, ...others } = props;
    return (
      <Form.Field className={clsx({ error: error })}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          id={id}
          className={className}
          name={name}
          ref={ref}
          {...others}
        />
        {isString(error) && (
          <div className={"ui pointing above prompt label"}>{error}</div>
        )}
      </Form.Field>
    );
  }
);
