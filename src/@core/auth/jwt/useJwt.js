// ** JWT Service Import
import JwtService from "./jwtService";
import AppApiService from "../../../services/AppApiService";

// ** Export Service as useJwt
export default function useJwt(jwtOverrideConfig: any) {
  const jwt = new AppApiService(jwtOverrideConfig);

  return {
    jwt,
  };
}
