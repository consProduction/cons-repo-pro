import { Suspense, useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps, NextPage } from "next";

import Layout from "../../components/ui/Layout";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../../context/authcontext";

import { ucfirst } from "../../utils/functions";
import axios from "axios";
import {
  Header,
  Informacion,
  RecomendadoPor,
} from "../../components/inmuebles/sections";
import { CustomImage } from "../../components/images/CustomImage";
import { ValidatedUser } from "..";
import { validarToken, validateSession } from "../../utils/functions";
import { UserRef } from "../../interfaces/user-type";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface Props {
  data: any;
  zonas_comunes: any;
  caracteristicas: any;
  imagenes: any;
  url_inmueble: any;
  related: any;
  validatedUser: ValidatedUser;
  userRef: UserRef;
}

const InmueblePage: NextPage<Props> = ({
  data,
  imagenes,
  url_inmueble,
  related,
  zonas_comunes,
  caracteristicas,
  validatedUser,
  userRef,
}) => {
  const userData = useContext(AuthContext);
  const navigate = useRouter();
  const headerProps = { imagenes, url_inmueble, data };

  const title = ucfirst(
    `${data.inmueble.toLowerCase()} en ${ucfirst(
      data.urbanizacion.toLowerCase()
    )} (${ucfirst(data.negocio.toLowerCase())})`
  );
  const Detalles = dynamic(
    () =>
      import("../../components/inmuebles/sections").then((mod) => mod.Detalles),
    { ssr: true }
  );
  const Caracteristicas = dynamic(
    () =>
      import("../../components/inmuebles/sections").then(
        (mod) => mod.Caracteristicas
      ),
    { ssr: true }
  );
  const ZonasComunes = dynamic(
    () =>
      import("../../components/inmuebles/sections").then(
        (mod) => mod.ZonasComunes
      ),
    { ssr: true }
  );
  const ChateaConNosotros = dynamic(
    () =>
      import("../../components/inmuebles/sections/aside").then(
        (mod) => mod.ChateaConNosotros
      ),
    { ssr: true }
  );
  const Compartir = dynamic(
    () =>
      import("../../components/inmuebles/sections/aside").then(
        (mod) => mod.Compartir
      ),
    { ssr: true }
  );
  const EnviarMensaje = dynamic(
    () =>
      import("../../components/inmuebles/sections/aside").then(
        (mod) => mod.EnviarMensaje
      ),
    { ssr: true }
  );
  const Recomendados = dynamic(
    () =>
      import(
        "../../components/inmuebles/sections/aside/recomendados/Recomendados"
      ).then((mod) => mod.Recomendados),
    { ssr: true }
  );

  useEffect(() => {
    validateSession(userData, validatedUser);
  }, []);
  return (
    <Layout title={title} description={data.descripcion_web}>
      {/* Seccion superior con modal de imagenes */}
      <Header {...headerProps} />

      {/* Seccion principal*/}
      <Grid
        container
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="space-evenly"
        columnSpacing={{ xs: 0, md: 1 }}
        rowSpacing={1}
        sx={{ width: "100%", p: { xs: 0, md: 1 } }}
      >
        {/* Seccion de Informacion del inmueble */}
        <Grid
          item
          xs={12}
          sm={12}
          md={0}
          display={{ xs: "row", md: "flex" }}
          wrap="wrap"
          gap={1}
        >
          {userRef.id !== 0 && (
            <RecomendadoPor data={data} userData={userRef} />
          )}
          {userData && Number(userData.rol) === 1 && (
            <Button
              disableElevation
              color="primary"
              onClick={() => navigate.push(`/photos/edit/${data.ficha_id}`)}
              fullWidth
              variant="contained"
              sx={{
                textTransform: "none",
                padding: 1.8,
                borderRadius: 3,
                mb: 1,
              }}
            >
              Editar fotos
            </Button>
          )}
          <Informacion data={data} />
          <Suspense fallback="Cargando detalles...">
            <Detalles data={data} />
          </Suspense>
          <Suspense fallback="Cargando caracteristicas...">
            <Caracteristicas caracteristicas={caracteristicas} />
          </Suspense>
          <Suspense fallback="Cargando zonas comunes...">
            <ZonasComunes zonasComunes={zonas_comunes} />
          </Suspense>
        </Grid>
      </Grid>

      {/* Seccion lateral/inferior */}
      <Grid
        container
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-evenly"
        columnSpacing={{ xs: 0, md: 1 }}
        rowSpacing={1}
        sx={{ width: "100%", p: { xs: 0, md: 1 } }}
      >
        <Grid item xs={12} sm={12} md={8}>
          <Box
            sx={{
              width: "100%",
              borderRadius: 5,
              overflow: "hidden",
              marginBottom: 1,
            }}
          >
            <Suspense fallback="Cargando...">
              <ChateaConNosotros data={data} userLogged={userRef} />
            </Suspense>
          </Box>

          <Box sx={{ width: "100%", borderRadius: 5, overflow: "hidden" }}>
            <CustomImage
              src={"/banner4.webp"}
              alt="Banner de publicidad - Consolitex"
            />
          </Box>
          {/* 
          <Grid item xs={12} sm={12} md={12}>
            <Suspense fallback="Cargando...">
              <EnviarMensaje data={data} />
            </Suspense>
          </Grid> */}
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container display="flex" sx={{ width: "100%" }} spacing={1}>
            {/* {userRef.id !== 0 && (
                            <Grid item xs={12}>
                                <Suspense fallback="Cargando...">
                                    <RecomendadoPor data={data} userData={userRef} />
                                </Suspense>
                            </Grid>
                        )} */}
            {userRef.id === 0 && (
              <Grid item xs={12} md={12}>
                <Suspense fallback="Cargando...">
                  <Compartir data={data} />
                </Suspense>
              </Grid>
            )}
            {/* <Grid item xs={12} md={12}>
              <Suspense fallback="Cargando...">
                <Recomendados related={related} />
              </Suspense>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const user = await validarToken(ctx);
  const ref = !!ctx.query.ref ? ctx.query.ref : "";
  let userRef: UserRef = {
    id: 0,
    usuario: "",
    password: "",
    email: "",
    nombre_y_apellido: "",
    cedula: "",
    telefono: "",
    genero: "",
    role: 0,
    foto: "",
    ref: "",
    created_at: "",
    status: 0,
  };
  if (ref) {
    const url_user_ref = `${process.ENV.USERS_URL}/v1/usuarios/index.php?ref=${ref}`;
    const respuesta_ref = await fetch(url_user_ref);
    switch (respuesta_ref.status) {
      case 200:
        const data_ref = await respuesta_ref.json();
        console.log("Usuario encontrado");
        userRef.id = data_ref.data.id;
        userRef.usuario = data_ref.data.usuario;
        userRef.password = data_ref.data.password;
        userRef.email = data_ref.data.email;
        userRef.nombre_y_apellido = data_ref.data.nombre_y_apellido;
        userRef.cedula = data_ref.data.cedula;
        userRef.telefono = data_ref.data.telefono;
        userRef.genero = data_ref.data.genero;
        userRef.role = data_ref.data.role;
        userRef.foto = data_ref.data.foto;
        userRef.ref = data_ref.data.ref;
        userRef.created_at = data_ref.data.created_at;
        userRef.status = data_ref.data.status;
        break;
      case 204:
        console.log("No se encontro el ref en la BD");
        break;
      case 400:
        console.log("Sin ref");
        break;
      default:
        console.log("Error interno del servidor al consultar el ref");
        break;
    }
  }

  try {
    const url = `${process.env.BASE_URL}/inmueble/fulldata2.php`;
    const respuesta = await axios.get(url, {
      params: {
        id,
      },
    });

    // const respuesta = await fetch(url);
    const data = await respuesta.data;
    const newImagenes = [
      data.imagenes && data.imagenes.hasOwnProperty("fachada")
        ? data.imagenes.fachada.map((arr: any) => arr)
        : "",
      data.imagenes && data.imagenes.hasOwnProperty("sala")
        ? data.imagenes.sala.map((arr: any) => arr)
        : "",
      data.imagenes && data.imagenes.hasOwnProperty("banos")
        ? data.imagenes.banos.map((arr: any) => arr)
        : "",
      data.imagenes && data.imagenes.hasOwnProperty("habitacion")
        ? data.imagenes.habitacion.map((arr: any) => arr)
        : "",
      data.imagenes && data.imagenes.hasOwnProperty("areascomunes")
        ? data.imagenes.areascomunes.map((arr: any) => arr)
        : "",
      data.imagenes && data.imagenes.hasOwnProperty("cocina")
        ? data.imagenes.cocina.map((arr: any) => arr)
        : "",
    ];
    return {
      props: {
        data: data.data,
        zonas_comunes: data.zonas_comunes,
        caracteristicas: data.caracteristicas,
        url_inmueble: data.url_inmueble,
        imagenes: newImagenes,
        related: data.related,
        validatedUser: {
          logged: user.id === 0 ? false : true,
          user,
        },
        userRef,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
};

export default InmueblePage;
