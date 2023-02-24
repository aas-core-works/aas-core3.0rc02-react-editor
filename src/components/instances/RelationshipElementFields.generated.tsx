//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.RelationshipElement|RelationshipElement}.
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

export function RelationshipElementFields(
  props: {
    snapInstance: Readonly<aas.types.RelationshipElement>,
    instance: aas.types.RelationshipElement,
  }
) {
  const [instanceErrors, setInstanceErrors] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForCategory, setErrorsForCategory] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForIdShort, setErrorsForIdShort] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForChecksum, setErrorsForChecksum] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForKind, setErrorsForKind] = React.useState<
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

      const anotherErrorsForCategory =
        errorsByProperty.get("category");
      setErrorsForCategory(
        anotherErrorsForCategory === undefined
          ? null
          : anotherErrorsForCategory
      );

      const anotherErrorsForIdShort =
        errorsByProperty.get("idShort");
      setErrorsForIdShort(
        anotherErrorsForIdShort === undefined
          ? null
          : anotherErrorsForIdShort
      );

      const anotherErrorsForChecksum =
        errorsByProperty.get("checksum");
      setErrorsForChecksum(
        anotherErrorsForChecksum === undefined
          ? null
          : anotherErrorsForChecksum
      );

      const anotherErrorsForKind =
        errorsByProperty.get("kind");
      setErrorsForKind(
        anotherErrorsForKind === undefined
          ? null
          : anotherErrorsForKind
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
      <fields.ListFieldOptional<aas.types.Extension>
        label="Extensions"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-extensions`
        }
        parent={props.instance}
        property="extensions"
        newInstanceDefinitions={
          newinstancing.FOR_EXTENSION
        }
        snapItems={
          props.snapInstance.extensions
        }
        items={
          props.instance.extensions
        }
        setItems={
          (items) => {
            props.instance.extensions = items;
          }
        }
      />

      <fields.TextFieldOptional
        label="Category"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-category`
        }
        value={props.snapInstance.category}
        onChange={
          (value) => {
            props.instance.category = value;
          }
        }
        errors={errorsForCategory}
      />

      <fields.TextFieldOptional
        label="Id short"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-id_short`
        }
        value={props.snapInstance.idShort}
        onChange={
          (value) => {
            props.instance.idShort = value;
          }
        }
        errors={errorsForIdShort}
      />

      <fields.ListFieldOptional<aas.types.LangString>
        label="Display name"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-display_name`
        }
        parent={props.instance}
        property="displayName"
        newInstanceDefinitions={
          newinstancing.FOR_LANG_STRING
        }
        snapItems={
          props.snapInstance.displayName
        }
        items={
          props.instance.displayName
        }
        setItems={
          (items) => {
            props.instance.displayName = items;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.LangString>
        label="Description"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-description`
        }
        parent={props.instance}
        property="description"
        newInstanceDefinitions={
          newinstancing.FOR_LANG_STRING
        }
        snapItems={
          props.snapInstance.description
        }
        items={
          props.instance.description
        }
        setItems={
          (items) => {
            props.instance.description = items;
          }
        }
      />

      <fields.TextFieldOptional
        label="Checksum"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-checksum`
        }
        value={props.snapInstance.checksum}
        onChange={
          (value) => {
            props.instance.checksum = value;
          }
        }
        errors={errorsForChecksum}
      />

      <fields.EnumerationFieldOptional
        label="Kind"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-kind`
        }
        getLiterals={aas.types.overModelingKind}
        literalToString={aas.stringification.mustModelingKindToString}
        selected={props.snapInstance.kind}
        onChange={
          (value) => {
            props.instance.kind = value;
          }
        }
        errors={errorsForKind}
      />

      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Semantic id"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-semantic_id`
        }
        parent={props.instance}
        property="semanticId"
        snapInstance={
          props.snapInstance.semanticId
        }
        instance={
          props.instance.semanticId
        }
        newInstanceDefinitions={
          newinstancing.FOR_REFERENCE
        }
        setInstance={
          (instance) => {
            props.instance.semanticId = instance;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.Reference>
        label="Supplemental semantic ids"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-supplemental_semantic_ids`
        }
        parent={props.instance}
        property="supplementalSemanticIds"
        newInstanceDefinitions={
          newinstancing.FOR_REFERENCE
        }
        snapItems={
          props.snapInstance.supplementalSemanticIds
        }
        items={
          props.instance.supplementalSemanticIds
        }
        setItems={
          (items) => {
            props.instance.supplementalSemanticIds = items;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.Qualifier>
        label="Qualifiers"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-qualifiers`
        }
        parent={props.instance}
        property="qualifiers"
        newInstanceDefinitions={
          newinstancing.FOR_QUALIFIER
        }
        snapItems={
          props.snapInstance.qualifiers
        }
        items={
          props.instance.qualifiers
        }
        setItems={
          (items) => {
            props.instance.qualifiers = items;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.EmbeddedDataSpecification>
        label="Embedded data specifications"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-embedded_data_specifications`
        }
        parent={props.instance}
        property="embeddedDataSpecifications"
        newInstanceDefinitions={
          newinstancing.FOR_EMBEDDED_DATA_SPECIFICATION
        }
        snapItems={
          props.snapInstance.embeddedDataSpecifications
        }
        items={
          props.instance.embeddedDataSpecifications
        }
        setItems={
          (items) => {
            props.instance.embeddedDataSpecifications = items;
          }
        }
      />

      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="First"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-first`
        }
        parent={props.instance}
        property="first"
        snapInstance={
          props.snapInstance.first
        }
        instance={
          props.instance.first
        }
        newInstanceDefinitions={
          newinstancing.FOR_REFERENCE
        }
        setInstance={
          (instance) => {
            props.instance.first = instance;
          }
        }
      />

      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="Second"
        helpUrl={
          `${help.ROOT_URL}/Relationship_element.html#property-second`
        }
        parent={props.instance}
        property="second"
        snapInstance={
          props.snapInstance.second
        }
        instance={
          props.instance.second
        }
        newInstanceDefinitions={
          newinstancing.FOR_REFERENCE
        }
        setInstance={
          (instance) => {
            props.instance.second = instance;
          }
        }
      />
    </>
  )
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//
