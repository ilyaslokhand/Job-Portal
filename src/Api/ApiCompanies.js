import superbaseclinet, { supabaseUrl } from "@/Utils/Superbase";

export async function getcompanies(token) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase.from("Compaines").select("*");

  if (error) {
    console.log("Error fectching compaines:", error);
    return null;
  }
  return data;
}

export async function addnewcompanies(token, _, companydata) {
  const superbase = await superbaseclinet(token);

  const Random = Math.floor(Math.random() * 90000);
  const Filename = `Logo-${Random}-${companydata.name}`;

  const { error: Storageerror } = await superbase.storage
    .from("company-logo")
    .upload(Filename, companydata.logo, {
      cacheControl: "3600",
      upsert: false, // Prevent overwriting existing files
    });

  if (Storageerror) {
    console.log("Error uploading Company Logo:", error);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/resumes/${Filename}`;

  const { data, error } = await superbase
    .from("Compaines")
    .insert([
      {
        name: companydata.name,
        logo_url,
      },
    ])
    .select();

  if (error) {
    console.log("Error Submittiing compaines:", error);
    return null;
  }
  return data;
}

export async function getSavedjobs(token) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("SavedJobs")
    .select("*, job:Jobs(*,company:Compaines(name,logo_url) )");

  if (error) {
    console.log("Error fectching SavedJobs:", error);
    return null;
  }
  return data;
}
