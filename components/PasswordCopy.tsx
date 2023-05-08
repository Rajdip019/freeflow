import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard, Box } from "@chakra-ui/react";

interface Props {
  align?: "right" | "left";
  value: string;
}

const PasswordCopy = ({ align = "left", value }: Props) => {
  const { onCopy, hasCopied } = useClipboard(value);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={align === "left" ? "flex-start" : "flex-end"}
      gap={2}
    >
      <span>&bull;&bull;&bull;&bull;&bull;&bull;</span>
      <CopyIcon
        className={"text-gray-400 hover:text-white"}
        color="text-gray-400"
        onClick={onCopy}
        cursor={"pointer"}
        h="1.25rem"
        w="1.25rem"
      />
    </Box>
  );
};

export default PasswordCopy;
