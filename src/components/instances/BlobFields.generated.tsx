//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.Blob|Blob}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as newinstancing from '../../newinstancing.generated';
import * as help from './help.generated';

export function BlobFields(
  props: {
    snapInstance: Readonly<aas.types.Blob>,
    instance: aas.types.Blob,
  }
) {
  return (
    <>
      <fields.ListFieldOptional<aas.types.Extension>
        label="Extensions"
        helpUrl={
          `${help.ROOT_URL}/Blob.html#property-extensions`
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
          `${help.ROOT_URL}/Blob.html#property-category`
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
          `${help.ROOT_URL}/Blob.html#property-id_short`
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
          `${help.ROOT_URL}/Blob.html#property-display_name`
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
          `${help.ROOT_URL}/Blob.html#property-description`
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
          `${help.ROOT_URL}/Blob.html#property-checksum`
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
          `${help.ROOT_URL}/Blob.html#property-kind`
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
          `${help.ROOT_URL}/Blob.html#property-semantic_id`
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
          `${help.ROOT_URL}/Blob.html#property-supplemental_semantic_ids`
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
          `${help.ROOT_URL}/Blob.html#property-qualifiers`
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
          `${help.ROOT_URL}/Blob.html#property-embedded_data_specifications`
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

      <fields.ByteArrayFieldOptional
        label="Value"
        helpUrl={
          `${help.ROOT_URL}/Blob.html#property-value`
        }
        value={props.snapInstance.value}
        onChange={
          (value) => {
            props.instance.value = value;
          }
        }
        contentType={props.snapInstance.contentType}
      />

      <fields.TextFieldRequired
        label="Content type"
        helpUrl={
          `${help.ROOT_URL}/Blob.html#property-content_type`
        }
        value={props.snapInstance.contentType}
        onChange={
          (value) => {
            props.instance.contentType = value;
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
