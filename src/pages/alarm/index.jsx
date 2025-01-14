import { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Switch,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import moment from "moment";

import TimePicker from "../../components/commons/DateTimePicker/TimePicker";
import ConfirmationModal from "../../components/commons/Modal/ConfirmationModal";
import notifications from './notification.ts';
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890', 6)

const Index = () => {
  const { colorMode } = useColorMode()
  const [isOpenTime, setIsOpenTime] = useState(false);
  const [currentAlarmData, setCurrentAlarmData] = useState(null);
  const [currentAlarmIndex, setCurrentAlarmIndex] = useState(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [indexDataDeleted, setIndexDataDeleted] = useState(null)
  const [dataAlarm, setDataAlarm] = useState(
    JSON.parse(localStorage.getItem("alarm_data")) ?? []
  );

  useEffect(() => {
    localStorage.setItem("alarm_data", JSON.stringify(dataAlarm));
  }, [dataAlarm]);

  const stopPropagation = (handler) => (event) => {
    event.stopPropagation();
    document.body.classList.remove('overlay-active');
    handler(event);
  };

  const handleTimeClick = (item, index) => {
    setCurrentAlarmData(item);
    setCurrentAlarmIndex(index);
    setIsOpenTime(!isOpenTime);
    document.body.classList.add('overlay-active');
  };

  const handleChangeAlarm = (value) => {
    const { time, label, isRepeat, repeatTime, repeatCategory } = value;

    if (currentAlarmIndex === null || currentAlarmIndex === undefined) {
      const uuid = nanoid();

      setDataAlarm([
        ...dataAlarm,
        { id: uuid, time: time, label, isRepeat, repeatTime, repeatCategory, isActive: true },
      ]);

      notifications.schedule(uuid, moment(time).format("HH"), moment(time).format("mm"))
    } else {
      setDataAlarm(
        dataAlarm.map((item, index) => {
          if (index === currentAlarmIndex) {
            item.time = time
            item.label = label
            item.isRepeat = isRepeat
            item.repeatTime = repeatTime
            item.repeatCategory = repeatCategory
          }
          return item
        })
      );
    }
    setIsOpenTime(false);
    document.body.classList.remove('overlay-active');
  };

  const showDeleteModal = (index) => {
    setIsShowDeleteModal(!isShowDeleteModal);
    setIndexDataDeleted(index);
    document.body.classList.remove('overlay-active');
  }

  const handleDeleteAlarm = () => {
    let listAlarm = [...dataAlarm];
    listAlarm.splice(indexDataDeleted, 1);
    setDataAlarm(listAlarm);
    showDeleteModal(null);
    setIsOpenTime(false);
    document.body.classList.remove('overlay-active');
  };

  const handleCancelAlarm = () => {
    setIsOpenTime(false);
    document.body.classList.remove('overlay-active');
  };

  const handleActivateAlarm = (indexAlarm) => {
    setDataAlarm((prevDataAlarm) =>
      prevDataAlarm.map((item, index) => {
        if (index === indexAlarm) {
          return { ...item, isActive: !item.isActive };
        }
        return item;
      })
    );
  };

  const getDayLabel = (time) => {
    const currentDate = new Date();
    const alarmTime = new Date();
    const [hours, minutes] = moment(time).format("HH:mm")?.split(":");
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);

    return alarmTime > currentDate ? "Today" : "Tomorrow";
  };

  return (
    <>
      <VStack w="100%" mb="5rem" mt="3">
        {dataAlarm?.map((item, index) => (
          <Box
            key={item.id}
            w="100%"
            bg={useColorModeValue('mutedBase.light', 'mutedBase.dark')}
            pt="2"
            pb="4"
            px="4"
            my="1"
            borderRadius="12px"
            sx={{ boxShadow: colorMode === 'light' ? '0px 8px 20px -4px #e5e5e5' : 'none' }}
            onClick={(e) => handleTimeClick(item, index)}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack alignItems="start" gap="0">
                <Text
                  fontSize="2rem"
                  textStyle="semi"
                >
                  {moment(item?.time)?.format("HH:mm")}
                </Text>
                <Text textStyle="xsmall">
                  {getDayLabel(item?.time)}
                </Text>
              </VStack>
              <Switch
                id="alarm-activated"
                mt="2"
                isChecked={item.isActive}
                onChange={stopPropagation(() => handleActivateAlarm(index))}
              />
            </HStack>
          </Box>
        ))}
      </VStack>
      <HStack
        justifyContent="center"
        bottom="70px"
        position="fixed"
        zIndex="99"
      >
        <Button
          variant={useColorModeValue('primary.light', 'primary.dark')}
          rounded="full"
          w="60px"
          h="60px"
          fontSize="30px"
          onClick={() => {
            setCurrentAlarmIndex(null);
            setCurrentAlarmData(null);
            setIsOpenTime(!isOpenTime);
            document.body.classList.add('overlay-active');
          }}
        >
          +
        </Button>
      </HStack>
      {isOpenTime && (
        <TimePicker
          label={currentAlarmData?.label ?? ""}
          value={currentAlarmData ? new Date(currentAlarmData?.time) : null}
          isRepeat={currentAlarmData?.isRepeat}
          repeatTime={currentAlarmData?.repeatTime}
          repeatCategory={currentAlarmData?.repeatCategory}
          isNew={currentAlarmIndex === null}
          handleChange={handleChangeAlarm}
          toggle={handleCancelAlarm}
          handleDelete={() => showDeleteModal(currentAlarmIndex)}
        />
      )}
      <ConfirmationModal
        isOpen={isShowDeleteModal} 
        toggle={() => showDeleteModal(null)} 
        confirm={handleDeleteAlarm} 
        message="Are you sure you want to delete this alarm?"
        titleConfirm="Delete"
      />
    </>
  );
};

export default Index;
