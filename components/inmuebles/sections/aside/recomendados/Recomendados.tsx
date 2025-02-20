import { FC, MouseEvent, useRef } from "react";

import { IconButton, Box, Typography, Rating, Button } from "@mui/material";

import { useRouter } from "next/router";

import Slider from "react-slick";

import { ucfirst } from "../../../../../utils/functions";
import { CustomImage } from "../../../../images/CustomImage";

import { styles } from "../../styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

interface Props {
  related: any;
}

export const Recomendados: FC<Props> = ({ related }) => {
  const router = useRouter();
  const sliderRecomendadoRef = useRef<any>(null);
  const redirect = (e: MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.id;
    router.push(`/inmueble/${id}`);
  };
  const settings = {
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <Box sx={{ ...styles.contentBox }}>
      <Box sx={{ ...styles.gradientBoxSizes, ...styles.gradiantBoxShadow }}>
        <CustomImage
          upperBoxStyles={{
            borderRadius: 5,
            width: "100%",
            overflow: "hidden",
          }}
          src="/related.jpg"
          alt="inmuebles recomendados consolitex"
        />
        <Typography
          fontWeight="bold"
          variant="h6"
          sx={{ fontFamily: "Oxygen", textAlign: "center", fontSize: 16 }}
        >
          Inmuebles recomendados
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ fontFamily: "Oxygen", textAlign: "center" }}
        >
          ¡Estos son algunos inmuebles cerca de la zona del inmuele actual!
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: 250,
              mt: 2,
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              sx={styles_local.left}
              onClick={() =>
                sliderRecomendadoRef.current !== null
                  ? sliderRecomendadoRef?.current.slickPrev()
                  : false
              }
            >
              <ChevronLeftRounded />
            </IconButton>
            <IconButton
              size="small"
              sx={styles_local.right}
              onClick={() =>
                sliderRecomendadoRef.current !== null
                  ? sliderRecomendadoRef?.current.slickNext()
                  : false
              }
            >
              <ChevronRightRounded />
            </IconButton>

            <Slider ref={sliderRecomendadoRef} {...settings}>
              {related.map((rel: any) => (
                <Box component="div" key={rel.data.key}>
                  <Box component="div" sx={styles_local.imageContainer}>
                    <CustomImage
                      upperBoxStyles={styles_local.upperBox}
                      src={`${process.ENV.IMG_URL}/newImg.php?url=${encodeURI(
                        rel.url_inmueble
                      )}`}
                      alt={`Inmueble recomendado - ${rel.data.nombre}`}
                    />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                  >{`Código de inmueble ${ucfirst(
                    rel.data.ficha_id0
                  )}`}</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">{`${ucfirst(
                    rel.data.inmueble.toLowerCase()
                  )} en ${ucfirst(
                    rel.data.urbanizacion.toLowerCase()
                  )} (${ucfirst(rel.data.negocio.toLowerCase())})`}</Typography>
                  <Rating
                    name="size-small"
                    defaultValue={5}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="400"
                    color="text.secondary"
                  >{`${ucfirst(rel.data.habitaciones)} ${
                    Number(rel.data.habitaciones) !== 1
                      ? "Habitaciones"
                      : "Habitación"
                  } `}</Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight="400"
                    color="text.secondary"
                  >{`${ucfirst(rel.data.banos)} ${
                    Number(rel.data.banos) !== 1 ? "Baños" : "Baño"
                  } `}</Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight="400"
                    color="text.secondary"
                  >{`${ucfirst(rel.data.estacionamiento)} ${
                    Number(rel.data.estacionamiento) !== 1
                      ? "Estacionamientos"
                      : "Estacionamiento"
                  } `}</Typography>
                  <Button
                    id={rel.data.ficha_id}
                    onClick={redirect}
                    sx={styles_local.button}
                    variant="contained"
                    disableElevation
                  >
                    Ver inmueble
                  </Button>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const styles_local = {
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  upperBox: {
    width: 80,
    height: 80,
    borderRadius: 3,
    overflow: "hidden",
  },
  button: {
    p: 2,
    borderRadius: 5,
    textTransform: "none",
  },
  left: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: -25,
    zIndex: 90,
  },
  right: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: -25,
    zIndex: 90,
  },
};
