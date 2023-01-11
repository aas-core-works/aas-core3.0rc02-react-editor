//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

/**
 * Define a component with fields corresponding to properties of
 * {@link @aas-core-works/aas-core3.0rc02-typescript#types.SpecificAssetId|SpecificAssetId}.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as newinstancing from '../../newinstancing.generated';
import * as help from './help.generated';

export function SpecificAssetIdFields(
  props: {
    snapInstance: Readonly<aas.types.SpecificAssetId>,
    instance: aas.types.SpecificAssetId,
  }
) {
  return (
    <>
      <fields.EmbeddedInstanceOptional<aas.types.Reference>
        label="Semantic id"
        helpUrl={
          `${help.ROOT_URL}/Specific_asset_id.html#property-semantic_id`
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
          `${help.ROOT_URL}/Specific_asset_id.html#property-supplemental_semantic_ids`
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

      <fields.TextFieldRequired
        label="Name"
        helpUrl={
          `${help.ROOT_URL}/Specific_asset_id.html#property-name`
        }
        value={props.snapInstance.name}
        onChange={
          (value) => {
            props.instance.name = value;
          }
        }
      />

      <fields.TextFieldRequired
        label="Value"
        helpUrl={
          `${help.ROOT_URL}/Specific_asset_id.html#property-value`
        }
        value={props.snapInstance.value}
        onChange={
          (value) => {
            props.instance.value = value;
          }
        }
      />

      <fields.EmbeddedInstanceRequired<aas.types.Reference>
        label="External subject id"
        helpUrl={
          `${help.ROOT_URL}/Specific_asset_id.html#property-external_subject_id`
        }
        snapInstance={
          props.snapInstance.externalSubjectId
        }
        instance={
          props.instance.externalSubjectId
        }
        newInstanceDefinitions={
          newinstancing.forReference(
            props.instance
          )
        }
        setInstance={
          (instance) => {
            props.instance.externalSubjectId = instance;
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
