package stroom.auth.daos;

import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.PublicJsonWebKey;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.lang.JoseException;
import stroom.auth.db.tables.records.JsonWebKeyRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static stroom.auth.db.Tables.JSON_WEB_KEY;

@Singleton
public class JwkDao {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(JwkDao.class);
    private static final int MIN_KEY_AGE_MS = 1000 * 60 * 60 * 24;
    private static final int MAX_KEY_AGE_MS = 1000 * 60 * 60 * 24 * 2;

    private final DSLContext database;

    @Inject
    JwkDao(final Configuration jooqConfig) {
        database = DSL.using(jooqConfig);
    }

    /**
     * This will always return a list of public keys creating them if needed.
     */
    public List<PublicJsonWebKey> readJwk() {
//        // Delete old records.
//        deleteOldJwkRecords();

        // Add new records.
        addRecords();

        // Fetch back all records.
        final List<JsonWebKeyRecord> list = database.selectFrom(JSON_WEB_KEY).fetch();
        return list.stream()
                .map(r -> {
                    try {
                        return RsaJsonWebKey.Factory.newPublicJwk(r.getJson());
                    } catch (JoseException e) {
                        LOGGER.error("Unable to create JWK!", e);
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

    private void addRecords() {
        // FOr the time being just make sure there is a record.
        final List<JsonWebKeyRecord> list = database.selectFrom(JSON_WEB_KEY).fetch();
        if (list.size() < 1) {
            addRecord();
        }


//        final long oldest = System.currentTimeMillis() - MIN_KEY_AGE_MS;
//
//        final List<JsonWebKeyRecord> list = database.selectFrom(JSON_WEB_KEY).fetch();
//        long newest = 0;
//        for (JsonWebKeyRecord record : list) {
//            long createTime = 0;
//            if (record.getCreateTimeMs() != null) {
//                createTime = record.getCreateTimeMs();
//            }
//            newest = Math.max(newest, createTime);
//        }
//
//        if (newest < oldest) {
//            addRecord();
//        }
    }

    private void addRecord() {
        try {
            // We need to set up the jwkId so we know which JWTs were signed by which JWKs.
            String jwkId = UUID.randomUUID().toString();
            RsaJsonWebKey jwk = RsaJwkGenerator.generateJwk(2048);
            jwk.setKeyId(jwkId);
            jwk.setUse("sig");
            jwk.setAlgorithm("RS256");

            // Persist the public key
            JsonWebKeyRecord jwkRecord = new JsonWebKeyRecord();
            jwkRecord.setKeyid(jwkId);
            jwkRecord.setJson(jwk.toJson(JsonWebKey.OutputControlLevel.INCLUDE_PRIVATE));
            jwkRecord.setCreateTimeMs(System.currentTimeMillis());
            database.executeInsert(jwkRecord);
        } catch (JoseException e) {
            LOGGER.error("Unable to create JWK!", e);
            throw new RuntimeException(e);
        }
    }

    private void deleteOldJwkRecords() {
        final long oldest = System.currentTimeMillis() - MAX_KEY_AGE_MS;

        final List<JsonWebKeyRecord> list = database.selectFrom(JSON_WEB_KEY).fetch();
        for (JsonWebKeyRecord record : list) {
            long createTime = 0;
            if (record.getCreateTimeMs() != null) {
                createTime = record.getCreateTimeMs();
            }

            if (createTime < oldest) {
                database.deleteFrom(JSON_WEB_KEY).where(JSON_WEB_KEY.ID.eq(record.getId()));
            }
        }
    }
}
