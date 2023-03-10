/**
 * Associate instances with the corresponding fields components based on the runtime
 * type information.
 */

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import { ExtensionFields } from "./ExtensionFields.generated";
import { AdministrativeInformationFields } from "./AdministrativeInformationFields.generated";
import { QualifierFields } from "./QualifierFields.generated";
import { AssetAdministrationShellFields } from "./AssetAdministrationShellFields.generated";
import { AssetInformationFields } from "./AssetInformationFields.generated";
import { ResourceFields } from "./ResourceFields.generated";
import { SpecificAssetIdFields } from "./SpecificAssetIdFields.generated";
import { SubmodelFields } from "./SubmodelFields.generated";
import { RelationshipElementFields } from "./RelationshipElementFields.generated";
import { SubmodelElementListFields } from "./SubmodelElementListFields.generated";
import { SubmodelElementCollectionFields } from "./SubmodelElementCollectionFields.generated";
import { PropertyFields } from "./PropertyFields.generated";
import { MultiLanguagePropertyFields } from "./MultiLanguagePropertyFields.generated";
import { RangeFields } from "./RangeFields.generated";
import { ReferenceElementFields } from "./ReferenceElementFields.generated";
import { BlobFields } from "./BlobFields.generated";
import { FileFields } from "./FileFields.generated";
import { AnnotatedRelationshipElementFields } from "./AnnotatedRelationshipElementFields.generated";
import { EntityFields } from "./EntityFields.generated";
import { EventPayloadFields } from "./EventPayloadFields.generated";
import { BasicEventElementFields } from "./BasicEventElementFields.generated";
import { OperationFields } from "./OperationFields.generated";
import { OperationVariableFields } from "./OperationVariableFields.generated";
import { CapabilityFields } from "./CapabilityFields.generated";
import { ConceptDescriptionFields } from "./ConceptDescriptionFields.generated";
import { ReferenceFields } from "./ReferenceFields.generated";
import { KeyFields } from "./KeyFields.generated";
import { LangStringFields } from "./LangStringFields.generated";
import { EnvironmentFields } from "./EnvironmentFields.generated";
import { EmbeddedDataSpecificationFields } from "./EmbeddedDataSpecificationFields.generated";
import { ValueReferencePairFields } from "./ValueReferencePairFields.generated";
import { ValueListFields } from "./ValueListFields.generated";
import { DataSpecificationIec61360Fields } from "./DataSpecificationIec61360Fields.generated";
import { DataSpecificationPhysicalUnitFields } from "./DataSpecificationPhysicalUnitFields.generated";

function assertTypesMatch<ClassT extends aas.types.Class>(
  that: ClassT,
  other: Readonly<aas.types.Class>
): asserts other is ClassT {
  if (!aas.types.typesMatch(that, other)) {
    console.error(
      `Expected ${that.constructor.name}, but got ${other.constructor.name}`
    );
    throw new Error("Assertion violated");
  }
}

class FieldDispatcher extends aas.types.AbstractTransformerWithContext<
  Readonly<aas.types.Class>,
  React.ReactElement
> {
  transformExtensionWithContext(
    that: aas.types.Extension,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ExtensionFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformAdministrativeInformationWithContext(
    that: aas.types.AdministrativeInformation,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(AdministrativeInformationFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformQualifierWithContext(
    that: aas.types.Qualifier,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(QualifierFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformAssetAdministrationShellWithContext(
    that: aas.types.AssetAdministrationShell,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(AssetAdministrationShellFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformAssetInformationWithContext(
    that: aas.types.AssetInformation,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(AssetInformationFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformResourceWithContext(
    that: aas.types.Resource,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ResourceFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformSpecificAssetIdWithContext(
    that: aas.types.SpecificAssetId,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(SpecificAssetIdFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformSubmodelWithContext(
    that: aas.types.Submodel,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(SubmodelFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformRelationshipElementWithContext(
    that: aas.types.RelationshipElement,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(RelationshipElementFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformSubmodelElementListWithContext(
    that: aas.types.SubmodelElementList,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(SubmodelElementListFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformSubmodelElementCollectionWithContext(
    that: aas.types.SubmodelElementCollection,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(SubmodelElementCollectionFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformPropertyWithContext(
    that: aas.types.Property,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(PropertyFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformMultiLanguagePropertyWithContext(
    that: aas.types.MultiLanguageProperty,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(MultiLanguagePropertyFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformRangeWithContext(
    that: aas.types.Range,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(RangeFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformReferenceElementWithContext(
    that: aas.types.ReferenceElement,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ReferenceElementFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformBlobWithContext(
    that: aas.types.Blob,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(BlobFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformFileWithContext(
    that: aas.types.File,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(FileFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformAnnotatedRelationshipElementWithContext(
    that: aas.types.AnnotatedRelationshipElement,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(AnnotatedRelationshipElementFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformEntityWithContext(
    that: aas.types.Entity,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(EntityFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformEventPayloadWithContext(
    that: aas.types.EventPayload,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(EventPayloadFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformBasicEventElementWithContext(
    that: aas.types.BasicEventElement,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(BasicEventElementFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformOperationWithContext(
    that: aas.types.Operation,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(OperationFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformOperationVariableWithContext(
    that: aas.types.OperationVariable,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(OperationVariableFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformCapabilityWithContext(
    that: aas.types.Capability,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(CapabilityFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformConceptDescriptionWithContext(
    that: aas.types.ConceptDescription,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ConceptDescriptionFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformReferenceWithContext(
    that: aas.types.Reference,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ReferenceFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformKeyWithContext(
    that: aas.types.Key,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(KeyFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformLangStringWithContext(
    that: aas.types.LangString,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(LangStringFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformEnvironmentWithContext(
    that: aas.types.Environment,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(EnvironmentFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformEmbeddedDataSpecificationWithContext(
    that: aas.types.EmbeddedDataSpecification,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(EmbeddedDataSpecificationFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformValueReferencePairWithContext(
    that: aas.types.ValueReferencePair,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ValueReferencePairFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformValueListWithContext(
    that: aas.types.ValueList,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(ValueListFields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformDataSpecificationIec61360WithContext(
    that: aas.types.DataSpecificationIec61360,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(DataSpecificationIec61360Fields, {
      snapInstance: snap,
      instance: that,
    });
  }

  transformDataSpecificationPhysicalUnitWithContext(
    that: aas.types.DataSpecificationPhysicalUnit,
    snap: Readonly<aas.types.Class>
  ): React.ReactElement {
    assertTypesMatch(that, snap);

    return React.createElement(DataSpecificationPhysicalUnitFields, {
      snapInstance: snap,
      instance: that,
    });
  }
}

const FIELD_DISPATCHER = new FieldDispatcher();

export function componentFor(
  instance: aas.types.Class,
  snapInstance: aas.types.Class
): React.ReactElement {
  return FIELD_DISPATCHER.transformWithContext(instance, snapInstance);
}

//
// WARNING: this code has been automatically generated by codegen.
//
// DO NOT edit or append.
//
