-- 1. 修改 is_superadmin
ALTER TABLE "admin_user" ALTER COLUMN "is_superadmin" DROP DEFAULT;
ALTER TABLE "admin_user" ALTER COLUMN "is_superadmin" TYPE integer USING CASE WHEN "is_superadmin" THEN 1 ELSE 0 END;
ALTER TABLE "admin_user" ALTER COLUMN "is_superadmin" SET DEFAULT 1;

-- 2. 修改 must_reset_password
ALTER TABLE "admin_user" ALTER COLUMN "must_reset_password" DROP DEFAULT;
ALTER TABLE "admin_user" ALTER COLUMN "must_reset_password" TYPE integer USING CASE WHEN "must_reset_password" THEN 1 ELSE 0 END;
ALTER TABLE "admin_user" ALTER COLUMN "must_reset_password" SET DEFAULT 1;