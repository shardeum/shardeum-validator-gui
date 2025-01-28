import useSWR from "swr";
import { useGlobals } from "../utils/globals";
import { useContext } from "react";
import { FetcherContext } from "../components/FetcherContextProvider";
import JSZip from "jszip";

type NodeLogsResponse = {
  isLoading: boolean;
  isError: boolean;
  logs: string[] | undefined;
  downloadLog: Function;
  clearAllLogs: Function;
  downloadAllLogs: Function;
};

export const useNodeLogs = (): NodeLogsResponse => {
  const { apiBase } = useGlobals();
  const fetcher = useContext(FetcherContext);

  const { data, error } = useSWR<string[], Error>(
    `${apiBase}/api/node/logs`,
    fetcher
  );

  const downloadLog = async (logName: string, getBlobOnly = false): Promise<Blob> => {
    const response = await fetch(`${apiBase}/api/node/logs/${logName}`, {
      method: "GET",
      credentials: 'include',
    })
    const blob = await response.blob();

    if (getBlobOnly) {
      return blob;
    }
    else {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", logName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      return new Blob();
    }
  };

  const clearAllLogs = async (): Promise<void> => {
    await fetch(`${apiBase}/api/node/logs`, {
      method: "DELETE",
      credentials: 'include',
    })
  }

  const downloadAllLogs = async (): Promise<void> => {
    try {
      let logsData = data;
      if (!logsData || logsData.length == 0 || error) {
        const response = await fetch(`${apiBase}/api/node/logs`, {
          method: "GET",
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        logsData = await response.json();
      }
      const zip = new JSZip();
      let fileName = "allLogs.zip";

      if (logsData && logsData.length > 0) {
        for (const logName of logsData) {
          try {
            const response = await fetch(
              `${apiBase}/api/node/logs/${logName}`,
              {
                method: "GET",
                credentials: 'include',
              }
            );

            if (!response.ok) {
              // Handle unsuccessful fetch by adding a log with the "downloaderror" prefix
              const errorLogName = `downloaderror_${logName}`;
              const errorText = `Failed to download ${logName}: ${response.statusText}`;
              zip.file(errorLogName, errorText);
            } else {
              const blob = await response.blob();
              zip.file(logName, blob, { binary: true });
            }
          } catch (error) {
            console.error(`Error while fetching ${logName}:`, error);
          }
        }

        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: "blob" });

        // Trigger the download of the zip file
        const zipUrl = window.URL.createObjectURL(zipBlob);
        const zipLink = document.createElement("a");
        zipLink.href = zipUrl;
        zipLink.setAttribute("download", fileName);
        document.body.appendChild(zipLink);
        zipLink.click();
        zipLink.parentNode?.removeChild(zipLink);
      }
    } catch (error) {
      console.error("Error while downloading all logs:", error);
    }
  };

  return {
    logs: data,
    isLoading: !data && !error,
    isError: !!error,
    downloadLog,
    clearAllLogs,
    downloadAllLogs,
  };
};
