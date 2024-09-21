import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "c98e64f4a25e4cadb94f207bb57f153a",
  },
});