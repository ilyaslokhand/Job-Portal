import superbaseclinet from "@/Utils/Superbase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const superbase = await superbaseclinet(token);
  let query = superbase
    .from("Jobs")
    .select("*, company: Compaines(name,logo_url), Saved  Jobs(Jobs(id))");
  const { data, error } = await query;

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("searchquery"`%${searchQuery}%`);
  }

  if (error) {
    console.log("Error Fetching Jobs:", error);
  } else {
    return data;
  }
}
