-------------------------------------------------------------------------
-- Update the seed API keys. We've added an 'aud' claim which must be
-- present for the keys to work.
-------------------------------------------------------------------------

UPDATE tokens
SET token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InN0cm9vbSIsImF1ZCI6IlBabkpyOGtIUktxbmxKUlFUaFNJIn0.qT5jdPWBpN9me0L3OqUT0VFT2mvVX9mCp0gPFyTVg8DkFTPLLYIuXjOslvrllJDBbqefEtqS9OwQs3RmRnZxror676stTP6JHN76YqJWj2yJYyJGuggbXjZnfTiZGO3SOxl5FP4nmRRvPxA3XqV9kippKBpHfqm5RuTpFTU8uses2iaHFm7lY4zXmKDmwVizXybBQBtpxrBNQkeQjQyg7UFkpsRO8-PmIdbTldRhGlud5VpntwI1_ahwOzK-einUJQOWrcOBmXAMPRYBI6tSLT1xS_c5XpFX1Rxoj3FGjI-Myqp_2Nt_lZuQ3h-0Qh8WkZMnWQ76G7CKawXzRAwd7Q"
WHERE user_id = (SELECT id FROM users WHERE email = 'stroomServiceUser');

UPDATE tokens
SET token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzdGF0c1NlcnZpY2VVc2VyIiwiaXNzIjoic3Ryb29tIiwiYXVkIjoiUFpuSnI4a0hSS3FubEpSUVRoU0kifQ.S_hKyhs5t5dtHuojNSsrrdwySpxQBDHDrzS_eebtUbIGcAeZ1GR-cxREcryL1I7nh-PwYxnxcGPVF94Rc1d4ATgDYALTVMdejyXNtvF1EGYc6aTnXsHnHw9DpBoW-QiPAxPgJuIwxJwmkmG_s52hirGq5E-fpCilds04dZ_3YRUb2EuTrhS7F1cmGysHflSuaVUcLKVBocZNZR530IotjqYTgXFbbIAtuVtsJnvV21_OMKVZwzfksFt_jyrXrz02Caev8p8Rbuzg2qh9cpXBshme2ZXKTJPJYvVZuNg6L89j0ql-ksGPI5B_bXCNZGvwGw6ieXuiaG_nwYp8bTrSaQ"
WHERE user_id = (SELECT id FROM users WHERE email = 'statsServiceUser');
