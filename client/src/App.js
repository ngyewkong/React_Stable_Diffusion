import "./App.css";
import {
  ChakraProvider,
  Container,
  Wrap,
  Stack,
  Text,
  Link,
  Heading,
  Input,
  Button,
  Image,
  SkeletonCircle,
  SkeletonText,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  // state to manage image & prompt
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState();
  const [shouldGenerate, setShouldGenerate] = useState(false);

  useEffect(() => {
    if (shouldGenerate) {
      generate(prompt);
      setShouldGenerate(false);
    }
  }, [prompt, shouldGenerate]);

  const generate = async (prompt) => {
    setLoading(true);
    if (prompt === null) {
      prompt = await axios.get("http://localhost:8000/random");
      setPrompt(prompt.data);
    }
    // for using deployed api on huggingface
    // prompt = await axios.get(
    //   "https://ngyewkong-stable-diffusion-api.hf.space/api/v1/stable-diffusion-api/random"
    // );
    const promptStr = prompt.toString();
    const response = await axios.get(
      `http://localhost:8000/generate?prompt=${promptStr}`
    );
    // for using deployed api on huggingface
    // await axios.get(
    //   `https://ngyewkong-stable-diffusion-api.hf.space/api/v1/stable-diffusion-api/generate?prompt=${prompt}`
    // );
    setImage(response.data);
    setLoading(false);
  };

  const clearInput = () => {
    document.getElementsByTagName("input")[0].value = "";
  };
  return (
    <ChakraProvider>
      <Container>
        <Heading margin={"10px"}>
          Stable Diffusion AI 🤖 - Auto Generated Images 🖼️
        </Heading>
        <Text>
          This react application leverages the model trained by Stability AI and
          Runway ML to generate images using the Stable Diffusion Deep Learning
          model. The model can be found via github here 👉 &nbsp;
          <Link
            color={"blue"}
            href="https://github.com/runwayml/stable-diffusion"
          >
            GitHub Repo
          </Link>
        </Text>
        <Wrap margin={"10px"}>
          <Input
            placeholder="Enter a prompt"
            className="prompt"
            width={"max-content"}
            onChange={(e) => e.target.value}
          ></Input>
          <Button
            colorScheme="green"
            onClick={(e) => {
              setPrompt(document.getElementsByTagName("input")[0].value);
              setShouldGenerate(true);
              clearInput();
            }}
          >
            Generate
          </Button>
          <Button
            colorScheme="red"
            onClick={(e) => {
              setPrompt(null);
              setShouldGenerate(true);
              clearInput();
            }}
          >
            I'm feeling lucky
          </Button>
        </Wrap>
        {loading ? (
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          </Box>
        ) : image ? (
          <Stack>
            <Image
              src={`data:image/png;base64,${image}`}
              boxShadow={"lg"}
            ></Image>
            <Text>{prompt}</Text>
          </Stack>
        ) : null}
      </Container>
    </ChakraProvider>
  );
}

export default App;
