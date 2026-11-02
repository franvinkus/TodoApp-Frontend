When initiating or creating a **Notification MCR** (Maintenance Change Request), the differentiation between **Common** and **Specific** is determined by the combination of three mandatory fields selected under **Service Detail**:

1. **Service Name** (`service`)
2. **Sub Service** (`subService`)
3. **Request Type** (`requestType`)

---

### How the Trigger Works

#### 1. Input on the Form (UI)
In [PMNotificationMCR/form.gsp](file:///c:/job_tomori/job-bpm-source/job-bpm-web/grails-app/views/PMNotificationMCR/form.gsp#L300-L340) and [notification-mcr.form.js](file:///c:/job_tomori/job-bpm-source/job-bpm-web/web-app/js/local/notification-mcr.form.js#L128-L153), the initiator selects:
* **Service Name**:
  * `SAP_CHANGES` (*SAP Changes*)
  * `PROCEDURAL_CHANGES` (*Procedural Changes*)
* **Sub Service** (filtered by chosen Service Name):
  * Under `SAP_CHANGES`: `MAINTENANCE_PLAN`, `MAINTENANCE_ITEM`, `FUNCTIONAL_LOCATION`, `EQUIPMENT`, `BOM`, `TASKLIST`, `CATALOG_PROFILE`
  * Under `PROCEDURAL_CHANGES`: `EXISTING_PROCEDURE`, `REQUEST_PROCEDURE`
* **Request Type**:
  * `NEW` (*New*)
  * `AMEND` (*Amend*)
  * `DELETE` (*Delete*)

---

#### 2. Database Lookup on Creation
When the initiator submits the form, [NotificationMCRBean.doCreateOrEdit()](file:///c:/job_tomori/job-bpm-source/job-bpm-pm/src/main/java/com/obor/job/bpm/pm/bean/NotificationMCRBean.java#L1468-L1472) queries the mapping table using [MapNotificationMCRTypeFacade](file:///c:/job_tomori/job-bpm-source/job-bpm-pm/src/main/java/com/obor/job/bpm/pm/facade/MapNotificationMCRTypeFacade.java#L30-L51):

```java
MapNotificationMCRType mcrType = mapNotificationMCRTypeFacade.findByKey(
        model.getService(),
        model.getSubService(),
        model.getRequestType());

process.setMcrType(mcrType.getType());
```

The lookup checks the database table `map_notification_mcr_type` (mapped by [MapNotificationMCRType](file:///c:/job_tomori/job-bpm-source/job-bpm-pm-interface/src/main/java/com/obor/job/bpm/entity/MapNotificationMCRType.java)):
* **Key**: `service`, `sub_service`, and `request_type` (via [MapNotificationMCRTypePK](file:///c:/job_tomori/job-bpm-source/job-bpm-pm-interface/src/main/java/com/obor/job/bpm/entity/MapNotificationMCRTypePK.java))
* **Result**: The column `type` contains either **`"COMMON"`** or **`"SPECIFIC"`**, which is stored in `pm_notification.mcr_type`.

---

#### 3. Workflow Routing Trigger (Approval Strategy)
During approval workflow initialization, [NotificationMCRBean.getCriteriaComparison()](file:///c:/job_tomori/job-bpm-source/job-bpm-pm/src/main/java/com/obor/job/bpm/pm/bean/NotificationMCRBean.java#L365-L388) compares against `ApprovalStrategyCriteriaEnum.PM_NOTIF_MCR_TYPE`:

* If `mcrType.getType()` is **`"COMMON"`**:
  * Triggers the **`PM_NOTIFICATION_MCR_COMMON`** strategy ([ApprovalStrategyCriteriaSeed](file:///c:/job_tomori/job-bpm-source/job-bpm-core-interface/src/main/java/com/obor/job/bpm/core/model/approval/ApprovalStrategyCriteriaSeed.java#L167)), consisting of a shorter 6-step approval flow.
* If `mcrType.getType()` is **`"SPECIFIC"`**:
  * Triggers the **`PM_NOTIFICATION_MCR_SPECIFIC`** strategy ([ApprovalStrategyCriteriaSeed](file:///c:/job_tomori/job-bpm-source/job-bpm-core-interface/src/main/java/com/obor/job/bpm/core/model/approval/ApprovalStrategyCriteriaSeed.java#L168)), consisting of an 18-step approval flow (including Technical Reviewers, Section Heads, Maintenance Superintendents, Asset Owner, etc.).

---

### Summary
The trigger differentiating **Common** vs. **Specific** is the **combination of `(Service Name, Sub Service, Request Type)`** mapped in the table **`map_notification_mcr_type`**. Its `type` value dictates whether the notification is flagged as `COMMON` or `SPECIFIC` and drives the corresponding approval workflow.