import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Alert from "@material-ui/lab/Alert";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import { withApollo } from "../utils/apollo";
import { gql, useMutation } from "@apollo/client";
import Layout from "../components/Layout";
import statesJson from "../src/states.json";
import localIpUrl from "local-ip-url";

const ADD_MEDIA = gql`
  mutation($mediaUrl: String, $states: States!, $expires: Date, $ip: String) {
    createCulturalMediaItem(
      data: { url: $mediaUrl, states: $states, expires: $expires, ip: $ip }
    ) {
      url
      states
      expires
    }
  }
`;

function Submit() {
  const ip = localIpUrl();

  const [completed, setCompleted] = useState(false);

  const { handleSubmit, register, errors, control, reset } = useForm();

  const [addMediaItem, { loading, error: mutationError }] = useMutation(
    ADD_MEDIA,
    {
      onCompleted() {
        reset({ states: "", mediaUrl: "", expires: "" });
        setCompleted(true);
      },
    }
  );

  const onSubmit = (values) => {
    setCompleted(false);
    if (values.expires == "") values.expires = null;
    addMediaItem({
      variables: { ...values, ip },
    });
  };

  return (
    <Layout>
      <Container
        style={{
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          my={2}
          suppressHydrationWarning={true}
          width="100%"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {mutationError && (
            <div>
              There was a problem with the form. Please try again later.
            </div>
          )}
          {completed && (
            <Alert
              onClose={() => {
                setCompleted(false);
              }}
            >
              Thanks for the submission! A moderator will review it before it
              goes live
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextField
                error={!!errors.mediaUrl}
                name="mediaUrl"
                label="Media Embed URL"
                variant="outlined"
                margin="normal"
                helperText={
                  errors.mediaUrl
                    ? errors.mediaUrl.message
                    : "YouTube, Vimeo, Wistia, Facebook, or Soundcloud"
                }
                inputRef={register({
                  required: "Required",
                  pattern: {
                    value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i,
                    message: "invalid url",
                  },
                })}
              />
            </div>
            <div>
              <FormControl
                error={!!errors.states}
                variant="outlined"
                style={{ minWidth: 100 }}
              >
                <InputLabel id="state-label">State</InputLabel>
                <Controller
                  as={
                    <Select labelId="state-label" label="State">
                      {statesJson.map((s) => (
                        <MenuItem key={s.abbreviation} value={s.abbreviation}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="states"
                  rules={{ required: "Required" }}
                  control={control}
                  defaultValue={""}
                />
                <FormHelperText style={{ marginLeft: 14, marginRight: 14 }}>
                  {errors?.states?.message}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <TextField
                error={!!errors.expires}
                name="expires"
                label="Expiration Date"
                variant="outlined"
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={
                  errors.expires
                    ? errors.expires.message
                    : "Leave blank if video will not expire "
                }
                inputRef={register()}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disableElevation
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}

export default withApollo({ ssr: true })(Submit);
