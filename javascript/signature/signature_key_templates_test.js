/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

goog.module('tink.signature.SignatureKeyTemplatesTest');
goog.setTestOnly('tink.signature.SignatureKeyTemplatesTest');

const {EcdsaPrivateKeyManager} = goog.require('google3.third_party.tink.javascript.signature.ecdsa_private_key_manager');
const {PbEcdsaKeyFormat, PbEcdsaSignatureEncoding, PbEllipticCurveType, PbHashType, PbOutputPrefixType} = goog.require('google3.third_party.tink.javascript.internal.proto');
const {SignatureKeyTemplates} = goog.require('google3.third_party.tink.javascript.signature.signature_key_templates');

describe('signature key templates test', function() {
  it('ecdsa p256', function() {
    // Expects function to create a key with following parameters.
    const expectedCurve = PbEllipticCurveType.NIST_P256;
    const expectedHashFunction = PbHashType.SHA256;
    const expectedEncoding = PbEcdsaSignatureEncoding.DER;
    const expectedOutputPrefix = PbOutputPrefixType.TINK;

    // Expected type URL is the one supported by EcdsaPrivateKeyManager.
    const manager = new EcdsaPrivateKeyManager();
    const expectedTypeUrl = manager.getKeyType();

    const keyTemplate = SignatureKeyTemplates.ecdsaP256();

    expect(keyTemplate.getTypeUrl()).toBe(expectedTypeUrl);
    expect(keyTemplate.getOutputPrefixType()).toBe(expectedOutputPrefix);

    // Test values in key format.
    const keyFormat =
        PbEcdsaKeyFormat.deserializeBinary(keyTemplate.getValue());
    const params = keyFormat.getParams();
    expect(params.getEncoding()).toBe(expectedEncoding);

    // Test key params.
    expect(params.getCurve()).toBe(expectedCurve);
    expect(params.getHashType()).toBe(expectedHashFunction);

    // Test that the template works with EcdsaPrivateKeyManager.
    manager.getKeyFactory().newKey(keyTemplate.getValue_asU8());
  });
});
