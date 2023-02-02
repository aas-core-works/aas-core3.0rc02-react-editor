//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.ConceptDescription|ConceptDescription}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as newinstancing from '../../newinstancing.generated';
import * as help from './help.generated';

export function ConceptDescriptionFields(
  props: {
    snapInstance: Readonly<aas.types.ConceptDescription>,
    instance: aas.types.ConceptDescription,
  }
) {
  return (
    <>
      <fields.ListFieldOptional<aas.types.Extension>
        label="Extensions"
        helpUrl={
          `${help.ROOT_URL}/Concept_description.html#property-extensions`
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
          `${help.ROOT_URL}/Concept_description.html#property-category`
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
          `${help.ROOT_URL}/Concept_description.html#property-id_short`
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
          `${help.ROOT_URL}/Concept_description.html#property-display_name`
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
          `${help.ROOT_URL}/Concept_description.html#property-description`
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
          `${help.ROOT_URL}/Concept_description.html#property-checksum`
        }
        value={props.snapInstance.checksum}
        onChange={
          (value) => {
            props.instance.checksum = value;
          }
        }
      />

      <fields.EmbeddedInstanceOptional<aas.types.AdministrativeInformation>
        label="Administration"
        helpUrl={
          `${help.ROOT_URL}/Concept_description.html#property-administration`
        }
        snapInstance={
          props.snapInstance.administration
        }
        instance={
          props.instance.administration
        }
        newInstanceDefinitions={
          newinstancing.forAdministrativeInformation(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.administration = instance;
          }
        }
      />

      <fields.TextFieldRequired
        label="Id"
        helpUrl={
          `${help.ROOT_URL}/Concept_description.html#property-id`
        }
        value={props.snapInstance.id}
        onChange={
          (value) => {
            props.instance.id = value;
          }
        }
      />

      <fields.ListFieldOptional<aas.types.EmbeddedDataSpecification>
        label="Embedded data specifications"
        helpUrl={
          `${help.ROOT_URL}/Concept_description.html#property-embedded_data_specifications`
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

      <fields.ListFieldOptional<aas.types.Reference>
        label="Is case of"
        helpUrl={
          `${help.ROOT_URL}/Concept_description.html#property-is_case_of`
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        snapItems={
          props.snapInstance.isCaseOf
        }
        items={
          props.instance.isCaseOf
        }
        setItems={
          (items) => {
            props.instance.isCaseOf = items;
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
