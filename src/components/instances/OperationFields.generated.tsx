//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.Operation|Operation}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as newinstancing from '../../newinstancing.generated';
import * as help from './help.generated';

export function OperationFields(
  props: {
    snapInstance: Readonly<aas.types.Operation>,
    instance: aas.types.Operation,
  }
) {
  return (
    <>
      <fields.ListFieldOptional<aas.types.Extension>
        label="Extensions"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-extensions`
        }
        newInstanceDefinitions={
          newinstancing.forExtension(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-category`
        }
        value={props.snapInstance.category}
        onChange={
          (value) => {
            props.instance.category = value;
          }
        }
      />

      <fields.TextFieldOptional
        label="Id short"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-id_short`
        }
        value={props.snapInstance.idShort}
        onChange={
          (value) => {
            props.instance.idShort = value;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.LangString>
        label="Display name"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-display_name`
        }
        newInstanceDefinitions={
          newinstancing.forLangString(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-description`
        }
        newInstanceDefinitions={
          newinstancing.forLangString(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-checksum`
        }
        value={props.snapInstance.checksum}
        onChange={
          (value) => {
            props.instance.checksum = value;
          }
        }
      />

      <fields.EnumerationFieldOptional
        label="Kind"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-kind`
        }
        getLiterals={aas.types.overModelingKind}
        literalToString={aas.stringification.mustModelingKindToString}
        selected={props.snapInstance.kind}
        onChange={
          (value) => {
            props.instance.kind = value;
          }
        }
      />

      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Semantic id"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-semantic_id`
        }
        snapInstance={
          props.snapInstance.semanticId
        }
        instance={
          props.instance.semanticId
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-supplemental_semantic_ids`
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-qualifiers`
        }
        newInstanceDefinitions={
          newinstancing.forQualifier(
            props.instance
          )
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
          `${help.ROOT_URL}/Operation.html#property-embedded_data_specifications`
        }
        newInstanceDefinitions={
          newinstancing.forEmbeddedDataSpecification(
            props.instance
          )
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

      <fields.ListFieldOptional<aas.types.OperationVariable>
        label="Input variables"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-input_variables`
        }
        newInstanceDefinitions={
          newinstancing.forOperationVariable(
            props.instance
          )
        }
        snapItems={
          props.snapInstance.inputVariables
        }
        items={
          props.instance.inputVariables
        }
        setItems={
          (items) => {
            props.instance.inputVariables = items;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.OperationVariable>
        label="Output variables"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-output_variables`
        }
        newInstanceDefinitions={
          newinstancing.forOperationVariable(
            props.instance
          )
        }
        snapItems={
          props.snapInstance.outputVariables
        }
        items={
          props.instance.outputVariables
        }
        setItems={
          (items) => {
            props.instance.outputVariables = items;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.OperationVariable>
        label="Inoutput variables"
        helpUrl={
          `${help.ROOT_URL}/Operation.html#property-inoutput_variables`
        }
        newInstanceDefinitions={
          newinstancing.forOperationVariable(
            props.instance
          )
        }
        snapItems={
          props.snapInstance.inoutputVariables
        }
        items={
          props.instance.inoutputVariables
        }
        setItems={
          (items) => {
            props.instance.inoutputVariables = items;
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
