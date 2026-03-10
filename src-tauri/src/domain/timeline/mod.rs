use serde::{Deserialize, Serialize};

use crate::domain::annotation::Annotation;

#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
pub enum SystemAction {
    ClearPrevious,
    KeepNext,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TimelineStep {
    Annotation { annotation: Annotation },
    System { action: SystemAction },
}
