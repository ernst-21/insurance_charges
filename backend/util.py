import pickle

__model = pickle.load(open("./artifacts/insurance_expenses_model.pickle", 'rb'))


def load_saved_artifacts():
    print("loading saved artifacts...start")
    print(__model)
    print("loading saved artifacts...done")


def calc_insurance(age, bmi, children, sex, smoker, region):
    sex_male = 1 if sex == 'male' else 0
    smoker_yes = 1 if smoker == 'yes' else 0

    if region == 'northwest':
        regions = [1, 0, 0]
    elif region == 'southeast':
        regions = [0, 1, 0]
    elif region == 'southwest':
        regions = [0, 0, 1]
    else:
        regions = [0, 0, 0]

    person_values = [age, bmi, children, sex_male, smoker_yes]
    final_values = person_values + regions

    return round(__model.predict([final_values])[0], 2)


if __name__ == '__main__':
    load_saved_artifacts()
    print(calc_insurance(23, 24.2, 2, 'female', 'no', 'northeast'))
    print(calc_insurance(52, 38.6, 2, 'male', 'no', 'southwest'))
