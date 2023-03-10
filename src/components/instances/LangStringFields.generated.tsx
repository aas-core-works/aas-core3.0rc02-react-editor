//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.LangString|LangString}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";
import * as valtio from "valtio";

import * as enhancing from "../../enhancing.generated";
import * as fields from "../fields";
import * as help from "./help.generated";
import * as model from "../../model";
import * as newinstancing from "../../newinstancing.generated";
import * as verification from "../../verification";
import * as widgets from "../widgets";

export function LangStringFields(
  props: {
    snapInstance: Readonly<aas.types.LangString>,
    instance: aas.types.LangString,
  }
) {
  const [instanceErrors, setInstanceErrors] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForLanguage, setErrorsForLanguage] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForText, setErrorsForText] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const snapErrorSetVersioning = valtio.useSnapshot(
    model.getErrorSet(props.instance).versioning
  );

  React.useEffect(
    () => {
      const [
        anotherInstanceErrors,
        errorsByProperty
      ] = verification.categorizeInstanceErrors(
        model.getErrorSet(props.instance)
      );

      setInstanceErrors(anotherInstanceErrors);

      const anotherErrorsForLanguage =
        errorsByProperty.get("language");
      setErrorsForLanguage(
        anotherErrorsForLanguage === undefined
          ? null
          : anotherErrorsForLanguage
      );

      const anotherErrorsForText =
        errorsByProperty.get("text");
      setErrorsForText(
        anotherErrorsForText === undefined
          ? null
          : anotherErrorsForText
      );
    },
    [
      snapErrorSetVersioning,
      props.instance
    ]
  );
  return (
    <>
    <widgets.LocalErrors errors={instanceErrors} />
      <fields.TextFieldRequired
        label="Language"
        helpUrl={
          `${help.ROOT_URL}/Lang_string.html#property-language`
        }
        value={props.snapInstance.language}
        onChange={
          (value) => {
            props.instance.language = value;
          }
        }
        errors={errorsForLanguage}
      />

      <fields.TextFieldRequired
        label="Text"
        helpUrl={
          `${help.ROOT_URL}/Lang_string.html#property-text`
        }
        value={props.snapInstance.text}
        onChange={
          (value) => {
            props.instance.text = value;
          }
        }
        errors={errorsForText}
      />
    </>
  )
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//
