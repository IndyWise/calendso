import { ClockIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useLocale } from "@lib/hooks/useLocale";
import { useToggleQuery } from "@lib/hooks/useToggleQuery";
import showToast from "@lib/notification";
import { trpc } from "@lib/trpc";

import { Dialog, DialogContent } from "@components/Dialog";
import Loader from "@components/Loader";
import Shell from "@components/Shell";
import { Alert } from "@components/ui/Alert";
import Button from "@components/ui/Button";

function convertMinsToHrsMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hours = h < 10 ? "0" + h : h;
  const minutes = m < 10 ? "0" + m : m;
  return `${hours}:${minutes}`;
}
export default function Availability() {
  const { t } = useLocale();
  const queryMe = trpc.useQuery(["viewer.me"]);
  const formModal = useToggleQuery("edit");

  const formMethods = useForm<{
    startHours: string;
    startMins: string;
    endHours: string;
    endMins: string;
    bufferHours: string;
    bufferMins: string;
  }>({});
  const router = useRouter();

  useEffect(() => {
    /**
     * This hook populates the form with new values as soon as the user is loaded or changes
     */
    const user = queryMe.data;
    if (formMethods.formState.isDirty || !user) {
      return;
    }
    formMethods.reset({
      startHours: convertMinsToHrsMins(user.startTime).split(":")[0],
      startMins: convertMinsToHrsMins(user.startTime).split(":")[1],
      endHours: convertMinsToHrsMins(user.endTime).split(":")[0],
      endMins: convertMinsToHrsMins(user.endTime).split(":")[1],
      bufferHours: convertMinsToHrsMins(user.bufferTime).split(":")[0],
      bufferMins: convertMinsToHrsMins(user.bufferTime).split(":")[1],
    });
  }, [formMethods, queryMe.data]);

  if (queryMe.status === "loading") {
    return <Loader />;
  }
  if (queryMe.status !== "success") {
    return <Alert severity="error" title={t("something_went_wrong")} />;
  }
  const user = queryMe.data;

  return (
    <div>
      <Shell heading={t("availability")} subtitle={t("configure_availability")}>
        <div className="flex">
          <div className="w-1/2 mr-2 bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{t("change_start_end")}</h3>
              <div className="max-w-xl mt-2 text-sm text-gray-500">
                <p>
                  {t("current_start_date")} {convertMinsToHrsMins(user.startTime)} {t("and_end_at")}{" "}
                  {convertMinsToHrsMins(user.endTime)}.
                </p>
              </div>
              <div className="mt-5">
                <Button href={formModal.hrefOn}>{t("change_available_times")}</Button>
              </div>
            </div>
          </div>

          <div className="w-1/2 ml-2 border border-gray-200 rounded-sm">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t("something_doesnt_look_right")}
              </h3>
              <div className="max-w-xl mt-2 text-sm text-gray-500">
                <p>{t("troubleshoot_availability")}</p>
              </div>
              <div className="mt-5">
                <Link href="/availability/troubleshoot">
                  <a className="btn btn-white">{t("launch_troubleshooter")}</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

                // TODO: Add validation
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const response = await fetch("/api/availability/day", {
                  method: "PATCH",
                  body: JSON.stringify({ start: startMins, end: endMins, buffer: bufferMins }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) {
                  showToast(t("something_went_wrong"), "error");
                  return;
                }
                await queryMe.refetch();
                router.push(formModal.hrefOff);

                showToast(t("start_end_changed_successfully"), "success");
              })}>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">
                  {t("start_time")}
                </label>
                <div>
                  <label htmlFor="startHours" className="sr-only">
                    {t("hours")}
                  </label>
                  <input
                    {...formMethods.register("startHours")}
                    id="startHours"
                    type="number"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="9"
                    defaultValue={convertMinsToHrsMins(user.startTime).split(":")[0]}
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="startMins" className="sr-only">
                    {t("minutes")}
                  </label>
                  <input
                    {...formMethods.register("startMins")}
                    id="startMins"
                    type="number"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">{t("end_time")}</label>
                <div>
                  <label htmlFor="endHours" className="sr-only">
                    {t("hours")}
                  </label>
                  <input
                    {...formMethods.register("endHours")}
                    type="number"
                    id="endHours"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="17"
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="endMins" className="sr-only">
                    {t("minutes")}
                  </label>
                  <input
                    {...formMethods.register("endMins")}
                    type="number"
                    id="endMins"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">{t("buffer")}</label>
                <div>
                  <label htmlFor="bufferHours" className="sr-only">
                    {t("hours")}
                  </label>
                  <input
                    {...formMethods.register("bufferHours")}
                    type="number"
                    id="bufferHours"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="bufferMins" className="sr-only">
                    {t("minutes")}
                  </label>
                  <input
                    {...formMethods.register("bufferMins")}
                    type="number"
                    id="bufferMins"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="mt-5 space-x-2 sm:mt-4 sm:flex">
                <Button href={formModal.hrefOff} color="secondary" tabIndex={-1}>
                  {t("cancel")}
                </Button>
                <Button type="submit" loading={formMethods.formState.isSubmitting}>
                  {t("update")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Shell>
    </div>
  );
}
