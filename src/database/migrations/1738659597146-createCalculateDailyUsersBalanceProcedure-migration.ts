import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCalculateDailyUsersBalanceProcedure1738659597146 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE FUNCTION calculate_monthly_users_balance(user_ids text, yesterday_was_holiday boolean) RETURNS void
                LANGUAGE plpgsql
            AS
            $$
            DECLARE
                user_id UUID;
                days_in_month INT;
                per_day_salary NUMERIC;
                final_balance NUMERIC;
                existing_balance NUMERIC;
                days_worked INT;
                balance_exists BOOLEAN;
                yesterday_date DATE;
            BEGIN
                days_in_month := EXTRACT(DAY FROM (date_trunc('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH' - INTERVAL '1 day'));
                yesterday_date := (NOW() - INTERVAL '1 day') AT TIME ZONE 'Asia/Bangkok';

                FOREACH user_id IN ARRAY string_to_array(user_ids, ',') LOOP
                    user_id := user_id::UUID;

                    SELECT EXISTS (
                        SELECT 1 FROM balances WHERE "userId" = user_id AND "balanceDate" = yesterday_date
                    ) INTO balance_exists;

                    IF balance_exists THEN
                        RAISE NOTICE 'balance exists';
                        SELECT "balance" INTO existing_balance FROM balances WHERE "userId" = user_id AND "balanceDate" = yesterday_date;
                        RAISE NOTICE 'existing balance: %', existing_balance;
                    ELSE
                        existing_balance := 0;
                    END IF;

                    SELECT u."salaryOrDailyRate" / days_in_month INTO per_day_salary FROM users u WHERE u.id = user_id;
                    RAISE NOTICE 'days in month: %', days_in_month;

                    IF yesterday_was_holiday THEN
                        final_balance := existing_balance + per_day_salary;
                        RAISE NOTICE 'holiday=true, final_balance: %', final_balance;
                    ELSE
                        SELECT COUNT(*) INTO days_worked FROM attendances a
                        JOIN users u ON a."userId" = u.id
                        WHERE u.id = user_id
                        AND EXTRACT(MONTH FROM a.date) = EXTRACT(MONTH FROM CURRENT_DATE)
                        AND EXTRACT(YEAR FROM a.date) = EXTRACT(YEAR FROM CURRENT_DATE)
                        AND a.status IN ('present', 'leave');

                        final_balance := days_worked * per_day_salary;
                        RAISE NOTICE 'not holiday, days_worked: %, per_day_salary: %, final_balance: %', days_worked, per_day_salary, final_balance;
                    END IF;

                    INSERT INTO balances ("balanceDate", "balance", "userId")
                    VALUES (yesterday_date, ROUND(final_balance,2), user_id)
                    ON CONFLICT ("balanceDate", "userId")
                    DO UPDATE SET "balance" = EXCLUDED."balance";
                END LOOP;
            END;
            $$;

            ALTER FUNCTION calculate_monthly_users_balance(text, boolean) OWNER TO postgres;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_monthly_users_balance(text, boolean)`);
    }
}
