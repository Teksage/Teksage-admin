import { useEffect, useState } from "react";
import {callAPI} from "../api/crudFactory"; // adjust if needed

type Params = {
  commonEndpoint: string; // API to get dropdowns or reusable list
  singleEndpoint?: string; // API for edit view (/entity/:id)
  id?: string | number;
  defaultFormData: any;
  transformCommonData?: (data: any) => any; // Optional transformer
  transformSingleData?: (data: any) => any; // Optional transformer
};

export const useFormData = ({
  commonEndpoint,
  singleEndpoint,
  id,
  defaultFormData,
  transformCommonData,
  transformSingleData,
}: Params) => {
  const [formData, setFormData] = useState<any>(defaultFormData);
  const [commonData, setCommonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch common data (dropdowns, plans, etc)
        const commonRes = await callAPI({
          endpoint: commonEndpoint,
          method: "get",
        });

        const finalCommonData = transformCommonData
          ? transformCommonData(commonRes.data)
          : commonRes.data;

        setCommonData(finalCommonData);

        // Fetch single item for edit mode
        if (id && singleEndpoint) {
          const singleRes = await callAPI({
            endpoint: `${singleEndpoint}/${id}`,
            method: "get",
          });

          const finalFormData = transformSingleData
            ? transformSingleData(singleRes.data)
            : singleRes.data;

          setFormData({
            ...defaultFormData,
            ...finalFormData,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Form data fetch failed", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [commonEndpoint, singleEndpoint, id]);

  return { formData, setFormData, commonData, loading };
};

// const { formData, setFormData, commonData: planData, loading } = useFormData({
//     commonEndpoint: "/api/admin/service-catalogs",
//     singleEndpoint: "/api/admin/coupons",
//     id: userId,
//     defaultFormData: {
//       coupon_name: "",
//       coupon_percentage: "",
//       max_cap: "",
//       start_date: null,
//       end_date: null,
//       plan_id: null,
//     },
//     transformCommonData: (data) =>
//       data.map((plan: any) => ({
//         id: plan.plan_id,
//         name: `${plan.plan_name} (${plan.duration_value} ${plan.duration_unit})`,
//       })),
//   });
  