import clsx from "clsx";
import { forwardRef, HTMLProps, ReactNode } from "react";
import { Form } from "semantic-ui-react";
import { isString } from "../../../helpers/is";

type Props = Omit<HTMLProps<HTMLTextAreaElement>, "label"> & {
  error?: boolean | string;
  label?: ReactNode;
};

export const FormUncontrolledTextArea = forwardRef<HTMLTextAreaElement, Props>(
  function FormUncontrolledTextArea(props, ref) {
    const { id, name, label, className, error, ...others } = props;

    return (
      <Form.Field className={clsx({ error: error })}>
        {label && <label htmlFor={id}>{label}</label>}
        <textarea
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
