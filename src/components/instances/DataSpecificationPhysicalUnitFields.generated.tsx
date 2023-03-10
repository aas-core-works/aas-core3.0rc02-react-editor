//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.DataSpecificationPhysicalUnit|DataSpecificationPhysicalUnit}.
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

export function DataSpecificationPhysicalUnitFields(
  props: {
    snapInstance: Readonly<aas.types.DataSpecificationPhysicalUnit>,
    instance: aas.types.DataSpecificationPhysicalUnit,
  }
) {
  const [instanceErrors, setInstanceErrors] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForUnitName, setErrorsForUnitName] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForUnitSymbol, setErrorsForUnitSymbol] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForSiNotation, setErrorsForSiNotation] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForSiName, setErrorsForSiName] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForDinNotation, setErrorsForDinNotation] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForEceName, setErrorsForEceName] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForEceCode, setErrorsForEceCode] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForNistName, setErrorsForNistName] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForSourceOfDefinition, setErrorsForSourceOfDefinition] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForConversionFactor, setErrorsForConversionFactor] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForRegistrationAuthorityId, setErrorsForRegistrationAuthorityId] = React.useState<
    Array<enhancing.TimestampedError> | null>(null);

  const [errorsForSupplier, setErrorsForSupplier] = React.useState<
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

      const anotherErrorsForUnitName =
        errorsByProperty.get("unitName");
      setErrorsForUnitName(
        anotherErrorsForUnitName === undefined
          ? null
          : anotherErrorsForUnitName
      );

      const anotherErrorsForUnitSymbol =
        errorsByProperty.get("unitSymbol");
      setErrorsForUnitSymbol(
        anotherErrorsForUnitSymbol === undefined
          ? null
          : anotherErrorsForUnitSymbol
      );

      const anotherErrorsForSiNotation =
        errorsByProperty.get("siNotation");
      setErrorsForSiNotation(
        anotherErrorsForSiNotation === undefined
          ? null
          : anotherErrorsForSiNotation
      );

      const anotherErrorsForSiName =
        errorsByProperty.get("siName");
      setErrorsForSiName(
        anotherErrorsForSiName === undefined
          ? null
          : anotherErrorsForSiName
      );

      const anotherErrorsForDinNotation =
        errorsByProperty.get("dinNotation");
      setErrorsForDinNotation(
        anotherErrorsForDinNotation === undefined
          ? null
          : anotherErrorsForDinNotation
      );

      const anotherErrorsForEceName =
        errorsByProperty.get("eceName");
      setErrorsForEceName(
        anotherErrorsForEceName === undefined
          ? null
          : anotherErrorsForEceName
      );

      const anotherErrorsForEceCode =
        errorsByProperty.get("eceCode");
      setErrorsForEceCode(
        anotherErrorsForEceCode === undefined
          ? null
          : anotherErrorsForEceCode
      );

      const anotherErrorsForNistName =
        errorsByProperty.get("nistName");
      setErrorsForNistName(
        anotherErrorsForNistName === undefined
          ? null
          : anotherErrorsForNistName
      );

      const anotherErrorsForSourceOfDefinition =
        errorsByProperty.get("sourceOfDefinition");
      setErrorsForSourceOfDefinition(
        anotherErrorsForSourceOfDefinition === undefined
          ? null
          : anotherErrorsForSourceOfDefinition
      );

      const anotherErrorsForConversionFactor =
        errorsByProperty.get("conversionFactor");
      setErrorsForConversionFactor(
        anotherErrorsForConversionFactor === undefined
          ? null
          : anotherErrorsForConversionFactor
      );

      const anotherErrorsForRegistrationAuthorityId =
        errorsByProperty.get("registrationAuthorityId");
      setErrorsForRegistrationAuthorityId(
        anotherErrorsForRegistrationAuthorityId === undefined
          ? null
          : anotherErrorsForRegistrationAuthorityId
      );

      const anotherErrorsForSupplier =
        errorsByProperty.get("supplier");
      setErrorsForSupplier(
        anotherErrorsForSupplier === undefined
          ? null
          : anotherErrorsForSupplier
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
        label="Unit name"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-unit_name`
        }
        value={props.snapInstance.unitName}
        onChange={
          (value) => {
            props.instance.unitName = value;
          }
        }
        errors={errorsForUnitName}
      />

      <fields.TextFieldRequired
        label="Unit symbol"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-unit_symbol`
        }
        value={props.snapInstance.unitSymbol}
        onChange={
          (value) => {
            props.instance.unitSymbol = value;
          }
        }
        errors={errorsForUnitSymbol}
      />

      <fields.ListFieldRequired<aas.types.LangString>
        label="Definition"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-definition`
        }
        parent={props.instance}
        property="definition"
        newInstanceDefinitions={
          newinstancing.FOR_LANG_STRING
        }
        snapItems={
          props.snapInstance.definition
        }
        items={
          props.instance.definition
        }
        setItems={
          (items) => {
            props.instance.definition = items;
          }
        }
      />

      <fields.TextFieldOptional
        label="SI notation"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-SI_notation`
        }
        value={props.snapInstance.siNotation}
        onChange={
          (value) => {
            props.instance.siNotation = value;
          }
        }
        errors={errorsForSiNotation}
      />

      <fields.TextFieldOptional
        label="SI name"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-SI_name`
        }
        value={props.snapInstance.siName}
        onChange={
          (value) => {
            props.instance.siName = value;
          }
        }
        errors={errorsForSiName}
      />

      <fields.TextFieldOptional
        label="DIN notation"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-DIN_notation`
        }
        value={props.snapInstance.dinNotation}
        onChange={
          (value) => {
            props.instance.dinNotation = value;
          }
        }
        errors={errorsForDinNotation}
      />

      <fields.TextFieldOptional
        label="ECE name"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-ECE_name`
        }
        value={props.snapInstance.eceName}
        onChange={
          (value) => {
            props.instance.eceName = value;
          }
        }
        errors={errorsForEceName}
      />

      <fields.TextFieldOptional
        label="ECE code"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-ECE_code`
        }
        value={props.snapInstance.eceCode}
        onChange={
          (value) => {
            props.instance.eceCode = value;
          }
        }
        errors={errorsForEceCode}
      />

      <fields.TextFieldOptional
        label="NIST name"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-NIST_name`
        }
        value={props.snapInstance.nistName}
        onChange={
          (value) => {
            props.instance.nistName = value;
          }
        }
        errors={errorsForNistName}
      />

      <fields.TextFieldOptional
        label="Source of definition"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-source_of_definition`
        }
        value={props.snapInstance.sourceOfDefinition}
        onChange={
          (value) => {
            props.instance.sourceOfDefinition = value;
          }
        }
        errors={errorsForSourceOfDefinition}
      />

      <fields.TextFieldOptional
        label="Conversion factor"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-conversion_factor`
        }
        value={props.snapInstance.conversionFactor}
        onChange={
          (value) => {
            props.instance.conversionFactor = value;
          }
        }
        errors={errorsForConversionFactor}
      />

      <fields.TextFieldOptional
        label="Registration authority id"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-registration_authority_id`
        }
        value={props.snapInstance.registrationAuthorityId}
        onChange={
          (value) => {
            props.instance.registrationAuthorityId = value;
          }
        }
        errors={errorsForRegistrationAuthorityId}
      />

      <fields.TextFieldOptional
        label="Supplier"
        helpUrl={
          `${help.ROOT_URL}/Data_specification_physical_unit.html#property-supplier`
        }
        value={props.snapInstance.supplier}
        onChange={
          (value) => {
            props.instance.supplier = value;
          }
        }
        errors={errorsForSupplier}
      />
    </>
  )
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//
