import { useClipboard, Box, Tooltip } from "@chakra-ui/react";

interface Props {
  align?: "right" | "left";
  value: string;
}

const Copy = ({ align = "left", value }: Props) => {
  const { onCopy, hasCopied } = useClipboard(value);

  return (
    <Tooltip label={hasCopied ? "Copied!" : "Copy to clipboard"}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={align === "left" ? "flex-start" : "flex-end"}
        gap={2}
      >
        {hasCopied ? (
          <svg
            className="w-5 cursor-pointer text-gray-400 transition-all hover:text-gray-50"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
            />
          </svg>
        ) : (
          <svg
            className=" w-5 cursor-pointer text-gray-400 transition-all hover:text-gray-50"
            onClick={() => {
              onCopy();
            }}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
            />
          </svg>
        )}
      </Box>
    </Tooltip>
  );
};

export default Copy;
