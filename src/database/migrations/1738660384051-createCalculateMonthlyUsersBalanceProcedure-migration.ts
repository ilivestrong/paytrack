import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCalculateMonthlyUsersBalanceProcedureMigration1738660384051 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`
                CREATE FUNCTION calculate_daily_users_balance(user_ids text, yesterday_was_holiday boolean) RETURNS void
                LANGUAGE plpgsql
                AS
                $$
                DECLARE
                    user_id UUID;
                    final_balance NUMERIC;
                    existing_balance NUMERIC;
                    daily_rate NUMERIC;
                    balance_exists BOOLEAN;
                    yesterday_date DATE;
                BEGIN
                    yesterday_date := (NOW() - INTERVAL '1 day') AT TIME ZONE 'Asia/Bangkok';
    
                    FOREACH user_id IN ARRAY string_to_array(user_ids, ',') LOOP
                        user_id := user_id::UUID;
    
                        SELECT EXISTS (
                            SELECT 1 FROM balances WHERE "userId" = user_id and "balanceDate" = yesterday_date
                        ) INTO balance_exists;
    
                        IF balance_exists THEN
                            RAISE NOTICE 'balance exists';
                            SELECT "balance" INTO existing_balance
                            FROM balances
                            WHERE "userId" = user_id and "balanceDate" = yesterday_date;
                            RAISE NOTICE 'existing balance: %', existing_balance;
                        ELSE
                            existing_balance := 0;
                        END IF;
    
                        SELECT u."salaryOrDailyRate"
                        INTO daily_rate
                        FROM users u
                        WHERE u.id = user_id;
    
                        RAISE NOTICE 'daily_rate: %', daily_rate;
    
                        IF NOT yesterday_was_holiday THEN
                            final_balance := existing_balance + daily_rate;
                            RAISE NOTICE 'holiday=false, final_balance: %', final_balance;
    
                            INSERT INTO balances ("balanceDate", "balance", "userId")
                            VALUES (yesterday_date, ROUND(final_balance,2), user_id)
                            ON CONFLICT ("balanceDate", "userId")
                            DO UPDATE SET "balance" = EXCLUDED."balance";
                        END IF;
                    END LOOP;
                END;
                $$;
    
                ALTER FUNCTION calculate_daily_users_balance(text, boolean) OWNER TO postgres;
            `);
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_daily_users_balance(text, boolean);`);
        }
}
