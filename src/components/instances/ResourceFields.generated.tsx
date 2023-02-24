//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.Resource|Resource}.
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

export function ResourceFields(
  props: {
    snapInstance: Readonly<aas.types.Resource>,
    instance: aas.types.Resource,
  }
) {
  const [instanceErrors, setInstanceErrors] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForPath, setErrorsForPath] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForContentType, setErrorsForContentType] = React.useState<
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

      const anotherErrorsForPath =
        errorsByProperty.get("path");
      setErrorsForPath(
        anotherErrorsForPath === undefined
          ? null
          : anotherErrorsForPath
      );

      const anotherErrorsForContentType =
        errorsByProperty.get("contentType");
      setErrorsForContentType(
        anotherErrorsForContentType === undefined
          ? null
          : anotherErrorsForContentType
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
        label="Path"
        helpUrl={
          `${help.ROOT_URL}/Resource.html#property-path`
        }
        value={props.snapInstance.path}
        onChange={
          (value) => {
            props.instance.path = value;
          }
        }
        errors={errorsForPath}
      />

      <fields.TextFieldOptional
        label="Content type"
        helpUrl={
          `${help.ROOT_URL}/Resource.html#property-content_type`
        }
        value={props.snapInstance.contentType}
        onChange={
          (value) => {
            props.instance.contentType = value;
          }
        }
        errors={errorsForContentType}
      />
    </>
  )
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//