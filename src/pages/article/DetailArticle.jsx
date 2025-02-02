import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Image,
  VStack,
  Text,
  Skeleton,
  SkeletonText,
  useColorModeValue
} from "@chakra-ui/react";
import { Markup } from "interweave";
import useIcons from "../../assets/icons";
import useQueryFetch from "../../services/queries";
import moment from "moment";

const DetailArticle = () => {
  const icons = useIcons()
  const navigate = useNavigate();
  const { title } = useParams();
  const { data, isLoading } = useQueryFetch.getArticles({ title: title });
  const [dataDetail, setDataDetail] = useState({});

  useEffect(() => {
    if (data) setDataDetail(data?.data[0]);
  }, [data]);

  return (
    <VStack align="start" w="100%">
      {isLoading ? (
        <VStack>
          <Skeleton h="85px" />
          <SkeletonText noOfLines={4} />
        </VStack>
      ) : (
        <>
          <Image
            onClick={() => navigate("/article")}
            src={icons.arrowBack}
            w="30px"
            h="30px"
            p="10px"
            bg={useColorModeValue('primary.light', 'primary.dark')}
            rounded="full"
            position="sticky"
            zIndex="99"
            cursor="pointer"
          />
          <VStack gap="0" align="start" mt="4">
            <Box position="relative">
              <Image
                className="smooth-shadow"
                src={dataDetail.thumbnail}
                alt="img-article"
                objectFit="cover"
                borderRadius="8px"
              />
              <Badge
                className="glass-background"
                position="absolute"
                top="10px"
                left="10px"
                fontSize="10px"
                p="1"
                textTransform="capitalize"
              >
                Category
              </Badge>
            </Box>
            <Text textStyle="bold" fontSize="18px" mt="5" mb="1">
              {dataDetail.title}
            </Text>
            <Text textStyle="light" fontSize="10px" mt="auto" color="darkgray">
              {moment(dataDetail.pubDate).format("llll")}
            </Text>
          </VStack>
          <Text textStyle="primary" fontSize="14px">
            CNN News
          </Text>
          <VStack my="3" fontSize="15px" color={useColorModeValue('main.light', 'main.dark')}>
            <Markup content={dataDetail.description} />
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default DetailArticle;
