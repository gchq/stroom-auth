
/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const TOGGLE_RESET_IS_SUBMITTING = 'password/TOGGLE_RESET_IS_SUBMITTING';

const initialState = {
    isSubmitting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
      case TOGGLE_RESET_IS_SUBMITTING:
      return {
        ...state,
          isSubmitting: !state.isSubmitting,
      };

    default:
      return state;
  }
};

export function toggleResetIsSubmitting() {
  return {
    type: TOGGLE_RESET_IS_SUBMITTING
  };
}

